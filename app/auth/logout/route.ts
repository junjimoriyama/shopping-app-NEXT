import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  // リクエストURLを解析し、requestUrlへ格納
  const requestUrl = new URL(request.url)

  // Supabaseクライアントを初期化(cookies使用)
  const supabase = createRouteHandlerClient({cookies})

  // サインアウトさせる
  await supabase.auth.signOut()

  // トップページへリダイレクト
  return NextResponse.redirect(requestUrl.origin + '/', {
    status: 301,
  })
}