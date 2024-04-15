'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/store';
import { addToCart } from '@/lib/features/shopping/slice/ProductSlice';

// useRefを介してstoreのインスタンスを保持
// childrenはprops.childrenでReact.ReactNode型とすることでReactがレンダリングできるあらゆる内容（数値、文字列、JSX、子要素など）を含む
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // .currentを使うことで値が変更されても再レンダリングされない。
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
    // storeRef.current.dispatch(addToCart(state))
  }
  //
  return <Provider store={storeRef.current}>{children}</Provider>;

  // // StoreProviderコンポーネントの定義。このコンポーネントは、ReduxストアをReactコンポーネントツリーに提供する。
  // export default function StoreProvider({
  //   children // このコンポーネントが受け取る子コンポーネント。
  // }: {
  //   children: React.ReactNode // childrenの型定義。ReactNodeは、Reactがレンダリングできるあらゆる内容（数値、文字列、JSX、子要素など）を含む。
  // }) {
  //   // useRefフックを使用して、AppStore型の参照を作成。この参照は、Reduxストアのインスタンスを保持するために使用される。
  //   const storeRef = useRef<AppStore>()
  //   // storeRef.currentが未定義（つまり、まだストアが作成されていない）場合、新しいストアのインスタンスを作成してstoreRef.currentに割り当てる。
  //   if (!storeRef.current) {

  //     storeRef.current = makeStore() // makeStore関数を呼び出して、新しいReduxストアのインスタンスを作成。
  //   }

  //   // Providerコンポーネントを使用して、storeRef.currentに保持されているReduxストアをアプリケーションの他の部分でアクセスできるようにする。
  //   // childrenプロパティを通じて受け取った子コンポーネントをProviderコンポーネント内でレンダリングする。
  //   return <Provider store={storeRef.current}>{children}</Provider>
}
