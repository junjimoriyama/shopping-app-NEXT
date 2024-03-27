"use client";

import React, { ChangeEvent, use, useEffect, useState } from "react";
// Next
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import {
  fetchSupabaseData,
  addToCart,
  selectedCategory,
} from "@/lib/features/shopping/slice/ProductSlice";
import { PagiNation } from "../components/PagiNation";

// css
import "../../sass/product.scss";

const Product = () => {
  // state
  const { productList, total } = useAppSelector((state) => state.product);
  // 選択されている値
  const [categoryValue, setCategoryValue] = useState("all");

  const dispatch = useAppDispatch();

  useEffect(() => {
    // 合計額が0の場合のみ読み込む(基本初回時のみ実行)
    if (total <= 0) {
      dispatch(fetchSupabaseData());
    }
  }, []);

  useEffect(() => {
    // localStorage からカテゴリーの値を読み込む
    const savedCategoryValue = localStorage.getItem("categoryValue");
    if (savedCategoryValue) {
      setCategoryValue(savedCategoryValue);
    }
    localStorage.setItem("categoryValue", "all");
  }, []);

  // ページネーションの作成
  // 表示可能商品数
  const displayedCount = productList.filter((item) => item.display).length;
  // 表示件数
  const [perView, setPerView] = useState(1000);

  // 表示ページ開始
  const [startPageNum, setStartPageNum] = useState(0);
  // 表示ページ終了
  const [endPageNum, setEndPageNum] = useState(perView);
  // 現在のページ
  const [activePage, setActivePage] = useState(1);

  // ページ番号クリック
  const paginate = (num: number) => {
    // 最初のページ
    setStartPageNum(num * perView);
    // 最後のページ
    setEndPageNum(num * perView + perView);
  };

  // 前に戻るボタン
  const prevPagination = () => {
    if (startPageNum > 0) {
      setStartPageNum(startPageNum - perView);
      setEndPageNum(endPageNum - perView);
      setActivePage(activePage - 1);
    }
  };
  // 次に進むボタン
  const nextPagination = () => {
    if (endPageNum < displayedCount) {
      setStartPageNum(startPageNum + perView);
      setEndPageNum(endPageNum + perView);
      setActivePage(activePage + 1);
    }
  };

  

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // state
    setCategoryValue(e.target.value);
    // storage
    localStorage.setItem("categoryValue", e.target.value);
    // 表示
    dispatch(selectedCategory(e.target.value));

  // 表示件数とカテゴリーがallなら
  if (e.target.value === "all" && perView === displayedCount) {
    setEndPageNum(productList.length)
    setPerView(productList.length)
  } else {
    // それ以外の場合は、現在の表示件数へ
    setEndPageNum(perView)
  }
    // 開始ページを初めに
    setStartPageNum(0)
    // 現在のページを初期化
    setActivePage(1)
  };


  return (
    // <StoreProvider>
    <div className="product">
      <div className="title">ITEMS</div>

      <PagiNation
        perView={perView}
        setPerView={setPerView}
        displayedCount={displayedCount}
        paginate={paginate}
        prevPagination={prevPagination}
        nextPagination={nextPagination}
        activePage={activePage}
        setActivePage={setActivePage}
        setStartPageNum={setStartPageNum}
        setEndPageNum={setEndPageNum}
      />

      <div className="wrap">
        
        <select
          name="category"
          // カテゴリーに合う商品表示
          onChange={handleCategoryChange}
          value={categoryValue}
        >
          <option value="all">all</option>
          <option value="vegetables">vegetables</option>
          <option value="meat">meat</option>
          <option value="fish">fish</option>
          <option value="noodle">noodle</option>
        </select>
      </div>

      <ul className="productList">
        {/* display: trueのみ表示 */}
        {productList
          .filter((item) => item.display)
          // pagination
          .slice(startPageNum, endPageNum)
          .map((item) => {
            return (
              <li className="eachProduct" key={item.id}>
                <div className="image">
                  <Image
                    src={`/images/${item.img}`}
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>
                <div className="contents">
                  <div className="name">{item.name}</div>
                  <div className="price">¥{item.price}</div>
                </div>

                {/* cartページへ遷移 */}
                <Link href="/cart">
                  <div
                    className="addToCartBtn"
                    onClick={() => dispatch(addToCart(item.id))}
                  >
                    Add to Cart
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
    // </StoreProvider>
  );
};

export default Product;

// const perView = 2;
//   const displayedItemsCount = productList.filter(
//     (item) => item.display === true
//   ).length;
//   const totalPage: number = Math.ceil(displayedItemsCount / perView);

//   const [startCount, setStartCount] = useState(0);
//   const [endCount, setEndCount] = useState(perView);

//   const Pagination = (j: number) => {
//     setStartCount(j * perView)
//     setEndCount(j * perView + perView)
//   }

//   const prevPagination = () => {

//     if(startCount > 0 ) {
//       setStartCount(startCount - perView)
//       setEndCount(endCount - perView)
//     }
//   }

//   const nextPagination = () => {
//     if(endCount < displayedItemsCount) {
//       setStartCount(startCount + perView)
//       setEndCount(endCount + perView)
//     }
//   }

{
  /* <div className="pagination">
        <ul className="pageList"></ul> 
      </div> */
}

{
  /* <ul className="pageList">
          <div 
          className="prevBtn"
          onClick={() => prevPagination()}
          >◀︎</div>
          { Array.from({ length: totalPage }, (_, i) => i + 1).map((page, j) => {
            return <li
            key={j}
            className={`pageItem item${j + 1}`}
            onClick={() => Pagination(j)}
            >
              {page}
              </li>
          })}
          <div 
          className="nextBtn"
          onClick={() => nextPagination()}
          >▶︎</div>
        </ul> */
}
