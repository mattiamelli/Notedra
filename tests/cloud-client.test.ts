import {it,expect,vi} from 'vitest';
import {createClient} from '@supabase/supabase-js';
import {createSupabase} from '../src/cloud/supabase';
vi.mock('@supabase/supabase-js',()=>({createClient:vi.fn(()=>({auth:{}}))}));
it('self-review: repeated React setup reuses one SDK client per project configuration',()=>{
  const config={status:'configured' as const,url:'https://isolated.supabase.co',key:'sb_publishable_'+'a'.repeat(32)};
  expect(createSupabase(config)).toBe(createSupabase({...config}));expect(createClient).toHaveBeenCalledOnce();
});
