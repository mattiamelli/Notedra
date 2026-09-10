-- Step 14 corrective migration: a stale CAS is a permanent application conflict,
-- not PostgreSQL's retryable serialization_failure (40001).
begin;

create or replace function public.sync_learner_snapshot(expected_revision bigint, operation uuid, learner_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  owner_id uuid := auth.uid();
  existing public.learner_snapshots%rowtype;
  receipt public.learner_sync_operations%rowtype;
  fingerprint text;
  next_revision bigint;
  collection text;
  row_key text;
  old_record jsonb;
  new_record jsonb;
  record_id text;
  identities text[];
begin
  if owner_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if operation is null or expected_revision is null or expected_revision < 0 or expected_revision >= 9007199254740991
    or learner_payload is null or jsonb_typeof(learner_payload) <> 'object'
    or octet_length(learner_payload::text) > 16000000
    or (select array_agg(key order by key) from jsonb_object_keys(learner_payload) as key)
      is distinct from array['attempts','content','examReviews','exams','reviews','schemaVersion']::text[]
    or learner_payload->'schemaVersion' is distinct from '3'::jsonb
    or jsonb_typeof(learner_payload->'content') is distinct from 'object'
  then raise exception 'Invalid cloud schema' using errcode = '22023'; end if;

  fingerprint := encode(sha256(convert_to(jsonb_build_object('revision',expected_revision,'payload',learner_payload)::text,'UTF8')),'hex');
  -- Serializes a user's first insert as well as later CAS writes; different users remain independent.
  perform pg_advisory_xact_lock(hashtextextended(owner_id::text, 0));
  select * into receipt from public.learner_sync_operations where user_id = owner_id and operation_id = operation;
  if found then
    if receipt.request_hash <> fingerprint then raise exception 'Operation conflict' using errcode = '23505'; end if;
    return jsonb_build_object('owner',owner_id,'revision',receipt.revision,'operationId',operation,'schema',1,'payload',learner_payload);
  end if;
  select * into existing from public.learner_snapshots where user_id = owner_id for update;
  if coalesce(existing.revision,0) <> expected_revision then raise sqlstate 'PT409' using message = 'Stale cloud revision'; end if;
  if existing.payload is not null and existing.payload->'content' is distinct from learner_payload->'content'
    then raise exception 'Content binding conflict' using errcode = '22023'; end if;

  foreach collection in array array['attempts','reviews','exams','examReviews'] loop
    if jsonb_typeof(learner_payload->collection) is distinct from 'array' then raise exception 'Invalid learner collection' using errcode = '22023'; end if;
    if jsonb_array_length(learner_payload->collection) > (case collection
      when 'attempts' then 5000
      when 'reviews' then 5000
      when 'exams' then 250
      else 16000
    end)
      then raise exception 'Learner capacity exceeded' using errcode = '22023'; end if;
    row_key := case when collection in ('attempts','reviews') then 'attemptId' else 'sessionId' end;
    identities := array[]::text[];
    for new_record in select value from jsonb_array_elements(learner_payload->collection) loop
      record_id := (new_record->>row_key) || case when collection = 'examReviews' then ':' || (new_record->>'itemId') else '' end;
      if record_id is null or length(record_id) = 0 or record_id = any(identities)
        or jsonb_typeof(new_record->'revision') is distinct from 'number' or (new_record->>'revision') !~ '^[1-9][0-9]*$'
        or (new_record->>'revision')::numeric > 9007199254740991
        then raise exception 'Invalid learner identity/revision' using errcode = '22023'; end if;
      identities := array_append(identities,record_id);
    end loop;
    for old_record in select value from jsonb_array_elements(coalesce(existing.payload->collection,'[]'::jsonb)) loop
      select value into new_record from jsonb_array_elements(learner_payload->collection)
        where value->row_key = old_record->row_key and (collection <> 'examReviews' or value->'itemId' = old_record->'itemId');
      if new_record is null then raise exception 'History deletion rejected' using errcode = '22023'; end if;
      if new_record is distinct from old_record then
        if old_record->>'status' in ('SUBMITTED','ABANDONED')
          or (new_record->>'revision')::numeric <= (old_record->>'revision')::numeric
          or (new_record - array['revision','status','answer','updatedAt','submission','responses','flagged','reviewedAt'])
            is distinct from (old_record - array['revision','status','answer','updatedAt','submission','responses','flagged','reviewedAt'])
          then raise exception 'Immutable history or workflow conflict' using errcode = '22023'; end if;
      end if;
    end loop;
  end loop;

  next_revision := expected_revision + 1;
  insert into public.learner_snapshots(user_id,revision,operation_id,schema_version,payload)
    values(owner_id,next_revision,operation,1,learner_payload)
    on conflict(user_id) do update set revision=excluded.revision,operation_id=excluded.operation_id,payload=excluded.payload,updated_at=now();
  insert into public.learner_sync_operations(user_id,operation_id,request_hash,revision) values(owner_id,operation,fingerprint,next_revision);
  return jsonb_build_object('owner',owner_id,'revision',next_revision,'operationId',operation,'schema',1,'payload',learner_payload);
end;
$$;
revoke all on function public.sync_learner_snapshot(bigint,uuid,jsonb) from public, anon, authenticated;
grant execute on function public.sync_learner_snapshot(bigint,uuid,jsonb) to authenticated;
commit;
