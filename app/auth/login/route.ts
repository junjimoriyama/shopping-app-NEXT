import { supabase } from './../../utils/supabase';
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


// Requestオブジェクトは、リクエストに関する情報を含む（Next.jsではなく、標準のWeb APIからのRequest）
export async function POST(request: Request) {
  // リクエストURLを解析し、requestUrlに格納。
  const requestUrl = new URL(request.url)

  // リクエストボディからフォームデータを非同期で取得します。
  const formData = await request.formData()

  // フォームデータから'email'と'password'フィールドの値を取得し、文字列に変換します。
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))

  // Supabaseクライアントを初期化(cookies使用)
  const supabase = createRouteHandlerClient({cookies})

  // Supabaseの認証機能を使用して、メールアドレスとパスワードでサインインします。
  await supabase.auth.signInWithPassword({
    email,
    password
  })
  // 認証が成功した後、ユーザーをプロフィールページにリダイレクト
  return NextResponse.redirect(requestUrl.origin + '/profile', {
    status: 301
  })
}
