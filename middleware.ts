

// middleware.ts
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


// ルートページのみ
export const config = {
  matcher: '/'
}


export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('sb-wxditbfjdropubngrnyh-auth-token');

  
  // 現在のURLパスを取得
  const url = request.nextUrl.clone()
  console.log(url)
  // リダイレクト条件をチェック（ここではルートパスにアクセスした場合）
  if (url.pathname === '/' && !sessionCookie) {
    console.log('ログイン')
    // 目的のパスにリダイレクト
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  } else if(url.pathname === '/' && sessionCookie) {
    console.log('product')
    url.pathname = '/product';
    return NextResponse.redirect(url);
  }
  // その他のケースでは何もしない
  console.log('何もしない')
  console.log(`sessionCookie ${ JSON.stringify(sessionCookie, null, 2)}`)
  return NextResponse.next();
}
