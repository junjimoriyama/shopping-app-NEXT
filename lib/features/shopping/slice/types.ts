

export interface initialState {
  // 静的要素
  productList: {
    id: number,
    name: string,
    price: number,
    img: string,
    category: string,
    amount: number,
    addedAt: number,
    display: boolean
  }[],
  // 動的要素
  total: number
  // selectedCategory: string; 
}

export interface pageInitialState {
  page: number | string
}