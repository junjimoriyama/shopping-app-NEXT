import { productSlice } from './features/shopping/slice/ProductSlice';
import { configureStore } from '@reduxjs/toolkit'
import productReducer  from './features/shopping/slice/ProductSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      product: productReducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// // stateの型
// export type RootState = ReturnType<typeof store.getState>
// // dispatchの型
// export type AppDispatch = typeof store.dispatch