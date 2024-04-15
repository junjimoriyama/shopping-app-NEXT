// import { supabase } from './../../app/utils/supabase';
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { initialState } from "./types";

// const initialState: initialState = {
//   productList: [],
//   total: 0
// }

// // 非同期処理
// export const fetchSupabaseData = createAsyncThunk('supabase/fetch',
//   async () => {
//     const { data, error } = await supabase.from('shopping').select('*')

//     if (error) {
//       throw new Error(error.message)
//     }

//     // dbのデータにreduxで管理するamountを追加
//     return data ? data.map(product => {
//       return {
//         ...product,
//         // 数
//         amount: 0,
//         // 時間順
//         addedAt: null,
//         // 表示有無
//         display: true
//       }
//     })
//       : []
//   }
// )

// export const productSlice = createSlice({
//   name: 'product',
//   initialState: initialState,
//   extraReducers(builder) {
//     // supabaseからデータ取得できたら
//     builder.addCase(fetchSupabaseData.fulfilled,
//       (state, action) => {
//         state.productList = action.payload
//       }
//     )
//   },
//   reducers: {
//     // カートへ追加ボタン押されたら
//     addToCart: ((state, action) => {
//       const addItem = state.productList.find(item => item.id === action.payload)
//       if (addItem) {
//         addItem.amount = addItem.amount + 1
//         // 時間を取得
//         addItem.addedAt = Date.now()
//       }
//     }),
//     // 商品の数を増やす
//     increaseItem: ((state, action) => {
//       const currentItem = state.productList.find(item => item.id === action.payload)
//       if (currentItem) {
//         currentItem.amount = currentItem?.amount + 1
//       }
//     }),
//     // 商品の数を減らす
//     decreaseItem: ((state, action) => {
//       const currentItem = state.productList.find(item => item.id === action.payload)
//       if (currentItem) {
//         if (currentItem.amount > 1) {
//           currentItem.amount = currentItem?.amount - 1
//         }
//       }
//     }),
//     // 商品を削除
//     deleteItem: ((state, action) => {
//       const currentItem = state.productList.find(item => item.id === action.payload)
//       if (currentItem) {
//         currentItem.amount = 0
//       }
//     }),
//     // 商品の合計額を計算
//     totalPrice: (state => {
//       let total = 0
//       state.productList.forEach(item => {
//         total += item.amount * item.price
//       })
//       state.total = total
//     }),

//     searchProduct: ((state, action) => {
//       state.productList.forEach(item => {
//         item.display = item.name.includes(action.payload)
//       })
//     })

//   }
// })

// // reducers
// export const { addToCart, increaseItem, decreaseItem, deleteItem, totalPrice, searchProduct } = productSlice.actions
// export default productSlice.reducer
