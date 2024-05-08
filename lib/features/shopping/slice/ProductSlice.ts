import { supabase } from '@/app/utils/supabase';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productInitialState } from './types';
import { fetchSupabaseData, getAllSupabaseData } from '@/app/utils/supabaseFunk';

const initialState: productInitialState = {
  productList: [],
  selectedImg: '',
  totalPrice: 0,
  selectedCategoryValue: 'all',
  // カゴに入れた数(同じ商品をクリックしてもカートに画像を表示させるため)
  clickCount: 0,
  // 検索文字
  searchWord: '',
};


// slice ==================================================
export const productSlice = createSlice({
  name: 'product',
  initialState: initialState,

  extraReducers(builder) {
    // supabaseからデータ取得できたら
    builder.addCase(fetchSupabaseData.fulfilled, (state, action) => {
      state.productList = action.payload;
    });
  },
  reducers: {
    // カートへ追加ボタン押されたら
    // TODO:カートに商品が入ったタイミングで合計額を計算
    addToCart: (state, action) => {
      const addItem = state.productList.find(
        (item) => item.id === action.payload,
      );
      if (addItem) {
        addItem.amount = addItem.amount + 1;
        // 時間を取得
        addItem.addedAt = Date.now();
      }
      let total = 0;
      state.productList.forEach((item) => {
        total += item.amount * item.price;
      });
      state.totalPrice = total;
    },
    // 商品の数を増やす
    increaseItem: (state, action) => {
      const currentItem = state.productList.find(
        (item) => item.id === action.payload,
      );
      if (currentItem) {
        currentItem.amount = currentItem?.amount + 1;
      }
    },
    // 商品の数を減らす
    decreaseItem: (state, action) => {
      const currentItem = state.productList.find(
        (item) => item.id === action.payload,
      );
      if (currentItem) {
        if (currentItem.amount > 1) {
          currentItem.amount = currentItem?.amount - 1;
        }
      }
    },
    // 商品を削除
    deleteItem: (state, action) => {
      const currentItem = state.productList.find(
        (item) => item.id === action.payload,
      );
      if (currentItem) {
        currentItem.amount = 0;
      }
    },
    // 全ての商品を削除
    allDeleteItem: (state) => {
      const currentItem = state.productList.map((item) => (item.amount = 0));
    },

    // 商品の合計額を計算
    calcTotalPrice: (state) => {
      console.log('test')
      let total = 0;
      state.productList.forEach((item) => {
        total += item.amount * item.price;
      });
      state.totalPrice = total;
    },
    // 文字検索
    searchProduct: (state, action) => {
      // 入力されている文字を取得
      state.searchWord = action.payload;
      state.productList.forEach((item) => {
        // カテゴリーがall又は合致するか判定、その後検索文字による判定
        item.display =
          (state.selectedCategoryValue === 'all' ||
            state.selectedCategoryValue === item.category) &&
          (!action.payload || item.name.includes(action.payload));
      });
    },
    // カテゴリー選択
    selectedCategory: (state, action) => {
      state.productList = state.productList.map((item) => {
        return {
          ...item,
          display:
            action.payload === 'all' || item.category === action.payload
              ? true
              : false,
        };
      });
    },
    // カテゴリーの値
    setSelectedCategory: (state, action) => {
      state.selectedCategoryValue = action.payload;
    },

    // 選択された画像
    setAddCartItemImg: (state, action) => {
      state.selectedImg = action.payload;
      state.clickCount = state.clickCount + 1;
    },

    // appearanceImageChange: (state, action) => {
    //   const currentItem = state.productList.find(item => item.id === action.payload.id)
    //   console.log(action.payload.fileImage)
    //   if (currentItem)
    //     currentItem.image = action.payload.fileImage
    // }
  },
});

// reducers
export const {
  addToCart,
  allDeleteItem,
  increaseItem,
  decreaseItem,
  deleteItem,
  calcTotalPrice,
  searchProduct,
  selectedCategory,
  setSelectedCategory,
  setAddCartItemImg,
  // appearanceImageChange,
} = productSlice.actions;
export default productSlice.reducer;