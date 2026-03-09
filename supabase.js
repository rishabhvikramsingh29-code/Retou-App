import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xbebfmhzdjeacdfakane.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_boPgUU7JXxcL87nb8wqxmw_bGc7dAAQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
