import { supabase } from "../utils/supabase"

// session取得
export const getSession = async() => {
  const {data: session, error} = await supabase.auth.getSession()
  if(error) {
    console.log("Session fetch error:", error)
  }
  return session
}