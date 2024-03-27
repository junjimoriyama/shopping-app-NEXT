import { supabase } from "../utils/supabase"

export const getAllSupabaseData = 
async () => {
  const allSupabaseData = await supabase.from('shopping').select('*')
}
