import { supabase } from '@/app/utils/supabase';

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productInitialState } from "./types";
import { getAllSupabaseData } from '@/app/utils/supabaseFunk';


const initialState: productInitialState = {
  productList: [],
  selectedImg: '',
  totalPrice: 0,
  selectedCategoryValue: 'all',
  // カゴに入れた数(同じ商品をクリックしてもカートに画像を表示させるため)
  clickCount: 0,
  // 検索文字
  searchWord: '',
}


// 非同期処理
// fetchSupabaseDataこの処理は初期化の処理なので一度のみ呼び出す
export const fetchSupabaseData = createAsyncThunk('supabase/fetch',
  async () => {
    const { data, error } = await supabase.from('shopping').select('*')
    if (error) {
      throw new Error(error.message)
    }

    // データを返すことでaction.payloadに接続できる
    // dbのデータにreduxで管理するamountを追加
    return data ? data.map(product => {
      return {
        ...product,
        // 数
        amount: 0,
        // 時間順
        addedAt: null,
        // 表示有無
        display: true
      }
    })
      : []
  }
)


// データの更新
export const updateSupabaseData = createAsyncThunk('product/update',
  async({id, upDateProductData}: {id:number, upDateProductData:{name: string, price: number, image: string, category: string}}) => {
    const {data, error} = await supabase
    .from('shopping')
    .update(upDateProductData)
    .match({id: id})

    if(error) {
      throw new Error(error.message)
    }
    
    return data
  }
)

// slice ==================================================
export const productSlice = createSlice({
  name: 'product',
  initialState: initialState,

  extraReducers(builder) {
    // supabaseからデータ取得できたら
    builder.addCase(fetchSupabaseData.fulfilled,
      (state, action) => {
        state.productList = action.payload
      }
    )
  },
  reducers: {
    // カートへ追加ボタン押されたら
    addToCart: ((state, action) => {
      const addItem = state.productList.find(item => item.id === action.payload)
      if (addItem) {
        addItem.amount = addItem.amount + 1
        // 時間を取得
        addItem.addedAt = Date.now()
      }
    }),
    // 商品の数を増やす
    increaseItem: ((state, action) => {
      const currentItem = state.productList.find(item => item.id === action.payload)
      if (currentItem) {
        currentItem.amount = currentItem?.amount + 1
      }
    }),
    // 商品の数を減らす
    decreaseItem: ((state, action) => {
      const currentItem = state.productList.find(item => item.id === action.payload)
      if (currentItem) {
        if (currentItem.amount > 1) {
          currentItem.amount = currentItem?.amount - 1
        }
      }
    }),
    // 商品を削除
    deleteItem: ((state, action) => {
      const currentItem = state.productList.find(item => item.id === action.payload)
      if (currentItem) {
        currentItem.amount = 0
      }
    }),
    // 全ての商品を削除
    allDeleteItem:((state) => {
      const currentItem = state.productList.map(
        item => item.amount = 0
      )
    }),

    // 商品の合計額を計算
    calcTotalPrice: (state => {
      let total = 0
      state.productList.forEach(item => {
        total += item.amount * item.price
      })
      state.totalPrice = total
    }),
    // 文字検索
    searchProduct: ((state, action) => {
      // 入力されている文字を取得
      state.searchWord = action.payload
      state.productList.forEach(item => {
        // カテゴリーがall又は合致するか判定、その後検索文字による判定
        item.display = (state.selectedCategoryValue === 
          'all' || state.selectedCategoryValue === item.category) && (!action.payload || item.name.includes(action.payload))
      });
    }),
    // カテゴリー選択
    selectedCategory: ((state, action) => {
      state.productList = state.productList.map(item => {
        return {
          ...item,
          display: action.payload === 'all' || item.category === action.payload ?
            true : false
        }
      })
    }),
    // カテゴリーの値
    setSelectedCategory: ((state, action) => {
      state.selectedCategoryValue = action.payload
    }),

    // 選択された画像
    setAddCartItemImg: ((state, action) => {
      state.selectedImg = action.payload
      state.clickCount = state.clickCount + 1
    }),
  }
})

// reducers
export const { addToCart, allDeleteItem, increaseItem, decreaseItem, deleteItem, calcTotalPrice, searchProduct, selectedCategory, setSelectedCategory, setAddCartItemImg } = productSlice.actions
export default productSlice.reducer

// 例えば手打ちでsetEndPageNum(16)と入力したら全ての商品が1ページに表示されるが、ページネーションはsetEndPageNumが4と仮定されたものとし

// export const updateSupabaseData = createAsyncThunk('product/update',
//   async({id, upDateProductData}: {id:number, upDateProductData: {name: string, price: number, image: string, category: string}}) => {
//     const {data, error} = await supabase
//     .from('shopping')
//     .update(upDateProductData)
//     .match({id: id})

//     if(error) {
//       throw new Error(error.message)
//     }
//     return data
//   }
// )