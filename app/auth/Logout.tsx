// import Head from "next/head";
// // import styles from "../styles/Home.module.css";
// import { supabase } from "../utils/supabase";
// import { useRouter } from 'next/router';

// export default function Top(){
//   const router = useRouter();

//   const Logout = async(e: React.FormEvent) => {
//     e.preventDefault();
//     try{
//       const { error:logoutError } = await supabase.auth.signOut()
//       if (logoutError) {
//         throw logoutError;
//       }
//       await router.push("/");
//     }catch{
//       alert('エラーが発生しました');
//     }
//   }
//   return(
//     <>
//       <div>
//       <Head>
//         <title>トップページ</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main>
//         <div>
//           <h1>トップページ</h1>
//           <form onSubmit={Logout}>
//             <button type="submit">ログアウトする</button>
//           </form>
//         </div>
//       </main>
//       <footer>
//       </footer>
//     </div>
//     </>
//   )
// }
