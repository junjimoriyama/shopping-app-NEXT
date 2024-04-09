
// product
export interface productInitialState {
  // 静的要素
  productList: {
    id: number,
    name: string,
    price: number,
    image: string,
    category: string,
    description: string,
    amount: number,
    addedAt: number,
    display: boolean
  }[],
  // 動的要素
  selectedImg: string,
  totalPrice: number
  selectedCategoryValue: string; 
  // カゴに入れた数(同じ商品をクリックしてもカートに画像を表示させるため)
  clickCount: number,
  // 検索文字
  searchWord: string
}

// cart
export interface pageInitialState {
  page: number | string
}

// category
export interface CategoryInitialState {
  categoryList: string[]
}

// auth
// export interface authInitialState {
//   signIn: boolean,
//   login: boolean
// }