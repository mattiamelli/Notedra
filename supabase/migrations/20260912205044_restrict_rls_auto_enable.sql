begin;

-- This event-trigger helper is an administrative safeguard, not a browser API.
-- Its behavior and every table policy remain unchanged; only client execution is removed.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is null then
    raise exception 'Expected administrative function public.rls_auto_enable() is missing';
  end if;
  execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
end
$$;

commit;
