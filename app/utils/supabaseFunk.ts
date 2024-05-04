// supabase
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../utils/supabase';
import { UserData } from '@/lib/features/shopping/slice/types';

// 全てのデータを取得関数
export const getAllSupabaseData = async () => {
  const allSupabaseData = await supabase.from('shopping').select('*');
};

// 非同期処理

/* データの取得 */
// fetchSupabaseDataこの処理は初期化の処理なので一度のみ呼び出す
export const fetchSupabaseData = createAsyncThunk(
  'supabase/fetch',
  async () => {
    const { data, error } = await supabase.from('shopping').select('*');
    if (error) {
      throw new Error(error.message);
    }

    // データを返すことでaction.payloadに接続できる
    // dbのデータにreduxで管理するamountを追加
    return data
      ? data.map((product) => {
        return {
          ...product,
          // 数
          amount: 0,
          // 時間順
          addedAt: null,
          // 表示有無
          display: true,
        };
      })
      : [];
  },
);

/* データの更新 */
export const updateSupabaseData = createAsyncThunk(
  'product/update',
  async ({
    id,
    upDateProductData,
  }: {
    id: number;
    upDateProductData: {
      name: string;
      price: number;
      image: string;
      category: string;
      description: string;
    };
  }) => {
    const { data, error } = await supabase
      .from('shopping')
      .update(upDateProductData)
      .match({ id: id });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
);


// データの追加
export const addSupabaseData = createAsyncThunk(
  'product/add',
  async ({ addNewProductData }: {
    addNewProductData: {
      name: string;
      price: number;
      image: string;
      category: string;
      description: string;
    }
  }) => {
    const { data, error } = await supabase
      .from('shopping')
      .insert(addNewProductData)

    if (error) {
      throw new Error(error.message)
    }
    return data
  }
)

// データ削除
export const deleteSupabaseData = createAsyncThunk(
  'product/delete',
  async (id: number) => {
    const { data, error } = await supabase
      .from('shopping')
      .delete()
      .match({ id: id })

    if (error) {
      throw new Error(error.message)
    }
    return data
  }
)

// ユーザーデータの取得
export const getUsersData = async () => {
  const { data: userData, error } = await supabase
    .from('users')
    .select('username, userImg')

    if(error) {
      throw new Error(error.message)
    }

    return userData
}

 // ユーザーデータ登録
  export const addUserSupabaseData = async (
    {
    userName,
    userImg,
    userId,
    isAdmin
  } : UserData
    ) => {
    // プロフィールを保存
    const { error: UserError } = await supabase
      .from('users')
      .insert({
        username: userName,
        userImg: userImg,
        userId: userId,
        isAdmin: isAdmin
      });
      // エラー
    if (UserError) {
      throw new Error(UserError.message);
    }
    
    // 画像をstorageへ保存
    // if (UserImg) {
    //   const file = UserInfo.UserImg;
    //   const filePath = file?.name
    //   console.log(filePath)
    //   if (file && filePath) {
    //     const { data: imageData, error:imageError } = await supabase.storage
    //       .from('account')
    //       .upload(filePath, file);
    //       console.log(imageData)

    //     if (imageError) {
    //       throw new Error(imageError.message);
    //     }
    //     // return data
    //   }
    // }
  }

  // export const sortPriceSupabaseData = async () => {
  //   console.log('test')
  //   const { data, error } = await supabase
  //   .from('shopping')
  //   .select('*')
  //   .order('price', {ascending: true})

  //   if (error) {
  //     throw new Error(error.message);
  //   }
  
  //   return data;
  // }
