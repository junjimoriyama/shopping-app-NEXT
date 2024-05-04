import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserData } from "./types";

// ユーザーデータの初期値
const initialState: UserData = {
  userName: '',
  userImg: null,
  userId: undefined,
  isAdmin: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    // 名前
    getUserName: (state, action) => {
      state.userName = action.payload
    },
    // 画像
    getUserImage: (state, action) => {
      const file = action.payload
      if (file) {
        state.userImg = file.name
      }
    },
    // ID
    getUserId: (state, action) => {
      state.userId = action.payload
    },
    // admin
    getUserAdmin: (state, action) => {
      state.isAdmin = action.payload
    }
  },
})

// reducers
export const {
  getUserName,
  getUserImage,
  getUserId,
  getUserAdmin
} = userSlice.actions;

export default userSlice.reducer;

