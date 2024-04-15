// supabase
import { createClient } from '@supabase/supabase-js';

// supabase初期化
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
