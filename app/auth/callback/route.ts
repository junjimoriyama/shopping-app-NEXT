import { NextRequest, NextResponse } from "next/server";

// import type { NextRequest } from 'next/server'

// NextRequestオブジェクトを引数として受け取り、リクエストの処理を行う。
export async function GET(request: NextRequest) {
  // リクエストURLを解析するために、URLオブジェクトを使用。
  // request.urlはリクエストされたURLの文字列を返す。
  const requestURL = new URL(request.url)

  // requestURL.originはリクエストされたURLのオリジン（プロトコル + ホスト名 + ポート番号）を返す。
  console.log(requestURL.origin)

  // リクエストされたURLのオリジンに基づいて、クライアントをオリジンのルートパス（'/'）にリダイレクト。
  return NextResponse.redirect(requestURL + '/')
}
