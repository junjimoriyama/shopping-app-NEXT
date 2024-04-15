// supabase
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../utils/supabase';

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
    .select('username, profileImg')

    if(error) {
      throw new Error(error.message)
    }

    return userData
}

// export const getUserId = async () => {
//   const {data: userId, error} = await supabase
//   .from('user')
//   .insert(session)
// }