import { supabase } from '@/app/utils/supabase';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { pageInitialState } from './types';

export const PageSlice = createSlice({
  name: 'page',
  initialState: { page: 'all' } as pageInitialState,

  reducers: {
    selectedNumber: (state, action: PayloadAction<number | string>) => {
      state.page = action.payload;
    },
  },
});

export const { selectedNumber } = PageSlice.actions;

export default PageSlice.reducer;
