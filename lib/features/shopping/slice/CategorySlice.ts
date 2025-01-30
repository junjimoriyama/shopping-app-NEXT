import { createSlice } from '@reduxjs/toolkit';
import { CategoryInitialState } from './types';

const initialState: CategoryInitialState = {
  categoryList: ['すべて', '野菜', '肉', '魚', '麺類'],
};

export const categorySlice = createSlice({
  name: 'category',
  initialState: initialState,
  reducers: {
    // カテゴリー追加
    addCategory: (state, action) => {
      const currentCategory = state.categoryList.map((category) => category);
      currentCategory.push(action.payload);
      state.categoryList = currentCategory;
    },
    // カテゴリー削除
    deleteCategory: (state, action) => {
      const currentCategory = state.categoryList.filter(
        (category) => category !== action.payload,
      );
      state.categoryList = currentCategory;
    },
  },
});

export const { addCategory, deleteCategory } = categorySlice.actions;

export default categorySlice.reducer;
