'use client';

// react
import { useEffect, useState } from 'react';
// next
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// supabase
import { supabase } from '../../utils/supabase';
// import { Session } from '@supabase/supabase-js';
// css
import '@/sass/auth/login.scss';
// import { getSession } from 'next-auth/react';
import { getSession } from '../session';
import { getUsersData } from '@/app/utils/supabaseFunk';
import { useAppDispatch } from '@/lib/hooks';
import { getUserAdmin, getUserId, getUserImage, getUserName } from '@/lib/features/shopping/slice/userSlice';

function Login() {

   /* redux ===========================================*/
   const dispatch = useAppDispatch();
  /* 変数 ===========================================*/
  const router = useRouter();

  /* hooks ===========================================*/
  // sessionの状態
  // const [sessionData, setSessionData] = useState<Session | null>(null);
  // メール
  const [email, setEmail] = useState('');
  // パスワード
  const [password, setPassword] = useState('');
  // 確認用パスワード
  const [passwordConf, setPasswordConf] = useState('');
  // 不一致メッセージ表示
  const [cantMatchMsg, setCantMatchMsg] = useState(false);

  /* 関数 ===========================================*/

  // // メールアドレスの重複チェック関数
  // const checkUserExists = async (email: string) => {
  //   const { data } = await supabase
  //     .from('users')
  //     .select('email')
  //     .eq('email', email)
  //     .single();

  //   // データベースにデータがあるか確認
  //   return data ? true : false;
  // };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // メールアドレスの重複チェック
    // const userExists = await checkUserExists(email);
    // if (userExists) {
    //   alert('このメールアドレスは既に使用されています。');
    //   return;
    // }

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (loginError) {
        throw loginError;
      }

      // reduxの状態に値を入れる
      // session取得
      const session = await getSession();

      const getUserState = async () => {
        const userId = session.session?.user.id;
        // もしsessionのidあればusersテーブルのidとする
        if (userId) {
          const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('userId', userId)
          .single();

          if (error) {
            console.log(error.message);
          }
          // 名前、画像、ID、adminの更新
          dispatch(getUserName(data.username))
          dispatch(getUserImage(data.userImg))
          dispatch(getUserId(data.userId))
          dispatch(getUserAdmin(data.isAdmin))
        }
      };
      getUserState();

      // email,password不一致メッセージ非表示
      setCantMatchMsg(false);
      router.push('/product');
    } catch (error) {
      // email,password不一致メッセージ表示
      setCantMatchMsg(true);
    }
  };

  // useEffect(() => {
  //   (async () => {
  //     // session取得
  //     const session = await getSession();

  //     const getUserId = async () => {
  //       const userId = session.session?.user.id;
  //       // もしsessionのidあればusersテーブルのidとする
  //       if (userId) {
  //         const { error } = await supabase
  //           .from('users')
  //           .insert([{ userId: session.session?.user.id }]);

  //         if (error) {
  //           console.log(error.message);
  //         }
  //       }
  //     };
  //     getUserId();
  //   })();
  // }, []);

  return (
    <>
      <div className="auth">
        {/* <div className="title">SUPER MARKET</div> */}
        <div className="login">
          <div className="formWrap">
            <div className="heading">login</div>
            <form className="loginForm" onSubmit={onLogin}>
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
                className={`cantMatchMsg ${cantMatchMsg ? 'isVisible' : ''}`}
              >
                password or email not match
              </div>

              <div className="btnWrap">
                <button className="loginBtn" type="submit">
                  login
                </button>
                <Link href="/auth/sendEmail">
                  <div className="forgetPassword">Forgot password</div>
                </Link>
              </div>
            </form>

            <div className="or">or</div>

            <Link href="/auth/signUp">
              <button className="moveSingUpBtn">Sing Up</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
