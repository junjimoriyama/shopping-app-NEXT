// supabase
import { supabase } from '../utils/supabase';

/* 関数 ===========================================*/
// session取得
export const getSession = async () => {
  const { data: session, error } = await supabase.auth.getSession();
  
  if (error) {
    console.log('Session fetch error:', error);
  }
  return session;
};
// pero197029@gmail.com