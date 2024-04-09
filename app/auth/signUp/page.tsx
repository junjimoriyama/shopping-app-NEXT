"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabase";

// css
import "@/sass/auth/signUp.scss";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });
      console.log(error)
      if (error?.message.includes('Email rate limit exceeded')) {
        setErrorMsg('リミットに到達しました。')
      }

      // 登録されているメールアドレスの場合、空の配列が返ってくる。
      // 分岐の条件見直し data.user?がない場合も想定
      const identities = data.user?.identities;
      if (identities?.length === 0) {
        setErrorMsg("既に登録済みのユーザーです。");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="signUp">
      <p className={ `errorMsg ${errorMsg ? 'isVisible' : ''}`}>
        {errorMsg}
      </p>

      <div className="signUpWrap">
        <div className="heading">sing Up</div>
        <form className="signUpForm" onSubmit={onSubmit}>
          <div className="inputForm">
            <label>mail</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label>password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <label>passwordConf</label>
            <input
              type="password"
              onChange={(e) => setPasswordConf(e.target.value)}
              value={passwordConf}
              required
            />
          </div>
          <div>
            <button className="signUpBtn" type="submit">
              signUp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
// pero197030@icloud.com
