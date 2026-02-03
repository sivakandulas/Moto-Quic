import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ajbmhhxgtmklbbmbjcpn.supabase.co';
const supabaseKey = 'sb_publishable_3vd63Gkv0ZU_57n13RNWLw_Ajx7z_wG';

export const supabase = createClient(supabaseUrl, supabaseKey);
