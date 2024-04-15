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

function Login() {
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
      setCantMatchMsg(false);
      router.push('/product');
    } catch (error) {
      // email,password不一致メッセージ表示
      setCantMatchMsg(true);
    }
  };

  useEffect(() => {
    (async () => {
      // session取得
      const session = await getSession();
      console.log(session.session?.user.id);

      const getUserId = async () => {
      const {error} =  await supabase
          .from('users')
          .insert([{'auth_id': session.session?.user.id}]);

          if(error) {
            console.log(error.message)
          }
      };
      getUserId()
    })();
  }, []);

  // profileImg
  // profileImg

  // const fetchSession = async() => {
  //   const session = await getSession();
  //   console.log('session', session)
  // }
  // fetchSession()

  // sessionの情報を元にuserDataをとってくる

  // useEffect(() => {

  //   const fetchSession = async() => {
  //     const session = await getSession();
  //     console.log('session', session)
  //   }
  //   fetchSession()
  //     // const usersData = await getUsersData();

  //     // const loggedInUserId = '';
  //     // const fetchUserData = async () => {
  //     //   //  const { data: { user }, error } = await supabase.auth.getUser()
  //     //   const { data, error } = await supabase
  //     //     .from('users')
  //     //     .select('username, profileImg')
  //     //     .eq('auth_id', loggedInUserId);
  //     //   console.log(data);

  //     //   if (error) {
  //     //     console.log(error.message);
  //     //   }
  //     // };
  //     // fetchUserData();
  //     // sessionの情報を元にuserDataをとってくる

  // }, []);
  // サインアップボタン押したらsupabaseへリクエスト投げる
  // ユーザー作るとログイン状態になる
  // session利用可能(中にidがある)
  // sessionの中からidを取り出す。そのままユーザーテーブルに新しくレコードを作る
  // ユーザーテーブルにuidを予め用意。そこにsessionから取り出したuidをセット
  // 同じuidで共通する情報を取得(ユーザーテーブルからuidを元に検索する)
  //  const {data, error} = await supabase
  //  .from('users')
  //  .select('*')
  //  .eq('user_id', loggedInUserId)
  //
  // もしダメならセッションのidだけでもreduxで管理しても良い
  // ログアウト時に削除する

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
