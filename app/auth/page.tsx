"use client";

import React, { useEffect, useState } from "react";
import { Login } from "./Login";
import { getSession } from "./Session";
// Session 型をインポート
import { Session } from "@supabase/supabase-js";

// css
import "@/sass/auth/auth.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Auth = () => {
  // const router = useRouter();
  const pathname = usePathname();
  // '/auth' パスでこのページにアクセスされた場合のみ showHeader を false にする
  const showHeader = pathname !== "/";

  // sessionの状態
  const [sessionData, setSessionData] = useState<Session | null>(null);

  // useEffect(() => {
  //   // セッション取得
  //   const fetchSession = async () => {
  //     const result = await getSession();
  //     setSessionData(result.session);
  //   };
  //   fetchSession();
  // }, []);

  return (
    <>
    <div className="title">SUPER MARKET</div>
    <div className="auth">
      {/* セッションがあれば<SignUp />表示しない */}
      <div className="authWrap">
        
        <Login />

        <div className="or">or</div>

        <Link href="/auth/signUp">
          <button className="moveSingUpBtn">Sing Up</button>
        </Link>
        
      </div>
    </div>
    </>
  );
};

export default Auth;
