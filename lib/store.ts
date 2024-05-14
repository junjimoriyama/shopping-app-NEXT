import { configureStore } from '@reduxjs/toolkit';
import productReducer from './features/shopping/slice/ProductSlice';
import pageReducer from './features/shopping/slice/PageSlice';
import categoryReducer from './features/shopping/slice/CategorySlice';
import userReducer from './features/shopping/slice/userSlice'
// import adminReduce from './features/shopping/slice/adminSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      product: productReducer,
      page: pageReducer,
      category: categoryReducer,
      user: userReducer,
      // admin: adminReduce
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// // stateの型
// export type RootState = ReturnType<typeof store.getState>
// // dispatchの型
// export type AppDispatch = typeof store.dispatch
