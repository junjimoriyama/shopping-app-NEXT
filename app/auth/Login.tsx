"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { supabase } from "../utils/supabase";
import Link from "next/link";

// css
import "@/sass/auth/login.scss";

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  // email,password不一致メッセージ表示
  const [ cantMatchMsg, setCantMatchMsg  ] = useState(false)


  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (loginError) {
        throw loginError;
      }
      // email,password不一致メッセージ非表示
      setCantMatchMsg(false)
      router.push("/product");
    } catch (error) {
      // email,password不一致メッセージ表示
      setCantMatchMsg(true)
    }
  };

  return (
    <div className="login">
      <div className="heading">login</div>
        <form
          className="loginForm"
          onSubmit={onLogin}
          // action="/auth/login"
          // method="post"
        >
          <div className="inputForm">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              placeholder="email"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              placeholder="password"
            />
            <input
              type="password"
              onChange={(e) => setPasswordConf(e.target.value)}
              value={passwordConf}
              required
              placeholder="passwordConf"
            />
          </div>

          <div 
          className={`cantMatchMsg ${cantMatchMsg ? 'isVisible' : '' }`}
          >
            password or email not match
          </div>

          <div className="btnWrap">
            <button className="loginBtn" type="submit">
              login
            </button>
            <Link href="/sendEmail">Forgot password</Link>
          </div>
        </form>

    </div>
  );
}
// export default Login