import {it,expect,vi} from 'vitest';
import {createClient} from '@supabase/supabase-js';
import {createSupabase,normalizeCloudWriteError} from '../src/cloud/supabase';
vi.mock('@supabase/supabase-js',()=>({createClient:vi.fn(()=>({auth:{}}))}));
it('self-review: repeated React setup reuses one SDK client per project configuration',()=>{
  const config={status:'configured' as const,url:'https://isolated.supabase.co',key:'sb_publishable_'+'a'.repeat(32)};
  expect(createSupabase(config)).toBe(createSupabase({...config}));expect(createClient).toHaveBeenCalledOnce();
});
it('maps only the stable PT409 stale-CAS contract to a definite conflict',()=>{
  expect(normalizeCloudWriteError({code:'PT409',message:'Stale cloud revision'}).code).toBe('CONFLICT');
  expect(normalizeCloudWriteError({code:'PT409',message:'Other conflict'}).code).toBe('NETWORK');
  expect(normalizeCloudWriteError({code:'409',message:'Stale cloud revision'}).code).toBe('NETWORK');
  expect(normalizeCloudWriteError({code:'PGRST003',message:'Timed out acquiring connection from connection pool.'}).code).toBe('NETWORK');
  expect(normalizeCloudWriteError({code:'23505',message:'Operation conflict'}).code).toBe('INVALID');
});
