'use client';

// css
import '@/sass/auth/createAccount.scss';
import { useEffect, useState } from 'react';

import { getSession } from '../session';
import {
  getUserAdmin,
  getUserId,
  getUserImage,
  getUserName,
} from '@/lib/features/shopping/slice/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addUserSupabaseData } from '@/app/utils/supabaseFunk';
import { UserData } from '@/lib/features/shopping/slice/types';

const page = () => {
  /* redux ===========================================*/
  const dispatch = useAppDispatch();

  /* state ===========================================*/
  // ユーザーの名前
  const { userName, userImg, userId, isAdmin } = useAppSelector((state) => state.user);

  // パラメーター取得
  const getParam = (param: string): string  => {
    try {
      let url = new URL(window.location.href);
      let value = url.searchParams.get(param);
      return value ? value : "";
    }
    catch (e) {
      return "";
    }
  }

  useEffect(() => {
    (async () => {
      // reduxでid管理
      dispatch(getUserId(getParam('userId')));
    })();
  }, []);

  // エラーメッセージ表示
  const [errorMsg, setErrorMsg] = useState('');

  //createボタンが押されたら
  const createExecution = async ({ userName, userImg, userId, isAdmin}: UserData) => {
    try {
      // データベースへ保存
      await addUserSupabaseData({ userName, userImg, userId, isAdmin });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      }
    }
  };

  // 送信ボタンが押されたら
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createExecution({ userName, userImg, userId, isAdmin });
  }; 
  const handleCheck = (e:React.ChangeEvent<HTMLInputElement>) => {
    dispatch(getUserAdmin(e.target.checked))
    // console.log(e.target.checked)
  };

  return (
    <div className="createAccount">
      {/* <div className="title">SUPER MARKET</div> */}
      <div className="formWrap">
        <div className="heading">create User</div>
        <form
          className="userForm"
          onSubmit={handleSubmit}
        >
          <div className="inputForm">
            <input
              type="text"
              onChange={(e) => {
                dispatch(getUserName(e.target.value));
              }}
              required
              placeholder="your name"
            />
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                // fileオブジェクトは非シリアライズ可能で直接reduxへ渡せない
                dispatch(
                  getUserImage({
                    name: file?.name,
                  }),
                );
              }}
              required
              placeholder="password"
              accept=".png, .jpg"
            />
            <div className="userImg" style={{ display: 'none' }}>
              <img src="" alt="userImg" />
            </div>

            <div className="userType">
              <input 
              type="checkbox" 
              value="admin"
              onChange={(e) => handleCheck(e)}
              />admin
            </div>
          </div>
          <div className="errorMsg">{errorMsg}</div>

          <div className="btnWrap">
            <button
              className="createBtn"
              type="submit"
            >
              create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;

/*  */
// http://localhost:3000/auth/createAccount?userId=a73c4b1c-f2b4-4c81-945d-29886789b118