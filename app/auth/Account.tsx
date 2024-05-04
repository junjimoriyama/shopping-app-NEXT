// 'use client'

// import { useEffect, useState } from 'react';
// // css
// import '../../sass/auth/account.scss';
// import { supabase } from '../utils/supabase';
// import { getUsersData } from '../utils/supabaseFunk';
// import { getSession } from '@/app/auth/session';




// export const Account = () => {


//   const [ user, setUser  ] = useState({username: '', profileImg: ''})


//   // ユーザーデータ取得
//   useEffect(() => {
//     (async() => {
//       const session = await getSession()
//       // console.log(session)

//       const usersData = await getUsersData();
//       setUser({username: usersData[0].username, profileImg: ''})
//       // console.log(usersData)

//       const fetchSession = async() => {
//         const session = await getSession();
//         // console.log('session', session)
//       }
//       fetchSession()
      
//       // sessionの情報を元にuserDataをとってくる
//     })()
//   }, [])

//   // ユーザーデータ取得
//   // useEffect(() => {
//   //   // 即時関数
//   //   (async () => {
//   //     const data = await getUsersData()
//   //     setUsername(data[0].username)
//   //   })()
//   // }, [])


//   // storageより画像取得
//   const {data} = supabase.storage
//   .from('account')
//   .getPublicUrl('myAccount/profile.jpg')

//   const publicURL = data.publicUrl


//   return (
//     <div className="myAccount">
//       <img src={publicURL} alt="myAccountImage" />
//       <div className="myName">{user.username}</div>
//     </div>
//   )
// }
