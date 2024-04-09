"use client";

import React, { ChangeEvent, use, useEffect, useRef, useState } from "react";
// Next
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import {
  fetchSupabaseData,
  addToCart,
  selectedCategory,
  setSelectedCategory,
  setAddCartItemImg,
  searchProduct,
  calcTotalPrice,
} from "@/lib/features/shopping/slice/ProductSlice";
import { PagiNation } from "../components/PagiNation";
import { getSession } from '@/app/auth/Session'

// css
import "../../sass/product.scss";
import { supabase } from "../utils/supabase";
import { Header } from "../components/Header";


// Product =============================================================
const Product = () => {
  // state
  // 商品、合計金額、カテゴリー選択
  const { productList, totalPrice, selectedCategoryValue } =
    useAppSelector((state) => state.product);

  const { categoryList } = useAppSelector((state) => 
    state.category)
  // ページ
  const { page } = useAppSelector((state) => state.page);

  // 選択されている値(selectedCategoryValueはreduxで管理)
  const [categoryValue, setCategoryValue] = useState(selectedCategoryValue);
  // dispatch
  const dispatch = useAppDispatch();

  // 初回レンダリング
  useEffect(() => {
    // 合計額が0の場合のみ読み込む(基本初回時のみ実行)
    if (totalPrice <= 0) {
      dispatch(fetchSupabaseData());
    }
  }, []);

  // ページネーションの作成
  // 表示可能商品数
  const displayedCount = productList.filter((item) => item.display).length;

  // 表示件数(商品数はdbより非同期で取得されるため全商品数以上の数字を入力)
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

  // カテゴリー選択
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // state
    setCategoryValue(e.target.value);
    // カテゴリー表示
    dispatch(selectedCategory(e.target.value));
    // カテゴリーの値
    dispatch(setSelectedCategory(e.target.value));

    // カテゴリーと表示件数がallなら
    if (e.target.value === "all" && page === "all") {
      setEndPageNum(productList.length);
      setPerView(productList.length);
    } else {
      // それ以外の場合は、現在の表示件数へ
      setEndPageNum(perView);
    }
    // 開始ページを初期化
    setStartPageNum(0);
    // 現在のページを初期化
    setActivePage(1);

    // 検索文字を空にする
    dispatch(searchProduct(""));
  };

  // 商品一覧の画面
  const productRef = useRef<HTMLUListElement>(null);
  // クリック
  const productCantClick = () => {
    if (productRef.current) {
      // カートに商品を表示する1秒間のanimation中はクリックできないようにする
      productRef.current.style.pointerEvents = "none";
      const timer = setTimeout(() => {
        if (productRef.current) {
          productRef.current.style.pointerEvents = "";
        }
      }, 1000);
      // クリーンアップ
      return () => clearTimeout(timer);
    }
  };

  // totalPriceを更新することでdetail画面に入って戻った時にカートの個数が0にならない。
  useEffect(() => {
    dispatch(calcTotalPrice());
  }, [productList]);

  // アニメーションを適用させる商品(idで照合)
  const [animationItemId, setAnimationItemId] = useState(0);

  // ボタンを沈ませる
  const sinkButton = (id: number) => {
    // クリックしたボタンに該当する商品を選ぶ
    setAnimationItemId(id);
  };

  // TODO:session取得 ============================================
  useEffect(() => {
    getSession()
  }, []);


  return (
    <>
    <div className="product">

      <div className="wrap">
        <div className="totalPrice">total ¥{totalPrice}</div>
      </div>

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
          {categoryList.map((category, index) => {
            return <option key={index}>{category}</option>
          })}
        </select>
      </div>

      <ul className="productList" ref={productRef}>
        {/* display: trueのみ表示 */}
        {productList
          .filter((item) => item.display)
          // pagination
          .slice(startPageNum, endPageNum)
          .map((item) => {
            return (
              <li
                className={`eachProduct ${
                  animationItemId === item.id ? "isAnimate" : ""
                }`}
                key={item.id}
              >
                <div className="image">
                  <Image
                    src={`/images/${item.image}`}
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
                <button
                  className="addToCartBtn"
                  onClick={() => {
                    dispatch(addToCart(item.id));
                    dispatch(setAddCartItemImg(item.image));
                    productCantClick();
                    sinkButton(item.id);
                  }}
                >
                  Add to Cart
                </button>
                <Link href={`/product/${item.name}`}>
                  <button className="detailBtn">detail</button>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
    </>
    // </StoreProvider>
  );
};

export default Product;

// ページネーションstateはカテゴリーが変わったタイミングで更新
// ページネーションstate:　ページ数、現在のページ、現在のページ更新関数
// 全件数などはページ数で渡す
