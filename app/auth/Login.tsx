// import Head from "next/head";
// // import styles from "../styles/Home.module.css";
// import { supabase } from "../utils/supabase";
// import { useState } from "react";
// import Link from 'next/link';
// import { useRouter } from 'next/router';

// export default function Login(){
//   const router = useRouter();
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [passwordConf, setPasswordConf] = useState("")

//   const onLogin = async(e: React.FormEvent) => {
//     e.preventDefault();
//     try{
//       const { error:signInError } = await supabase.auth.signInWithPassword({
//         email: email,
//         password: password,
//       })
//       if (signInError) {
//         throw signInError;
//       }
//       await router.push("/top");
//     }catch{
//       alert('エラーが発生しました');
//     }
//   }

//   return (
//     <div>
//       <Head>
//         <title>ログイン画面</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main>
//         <div>
//           <form onSubmit={onLogin}>
//           <div>
//             <label>メールアドレス</label>
//             <input type="email"
//               required value={email}
//               onChange={e => setEmail(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>パスワード</label>
//             <input type="password"
//               required value={password}
//               onChange={e => setPassword(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>パスワード（確認）</label>
//             <input type="password"
//               required value={passwordConf}
//               onChange={e => setPasswordConf(e.target.value)}
//             />
//           </div>
//           <div>
//             <button type="submit">ログイン</button><br/>
//             <Link href='/signup'>
//               ユーザー登録がお済みでない方はこちらから
//             </Link><br/>
//             <Link href='/sendemail'>
//               パスワードをお忘れの方はこちらから
//             </Link>
//           </div>
//         </form>
//         </div>
//       </main>
//       <footer>
//       </footer>
//     </div>
//   )
// }

