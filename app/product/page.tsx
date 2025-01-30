'use client';

// react
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
// next
import Image from 'next/image';
import Link from 'next/link';
// redux
import {
  addToCart,
  selectedCategory,
  setSelectedCategory,
  setAddCartItemImg,
  searchProduct,
  calcTotalPrice,
} from '@/lib/features/shopping/slice/ProductSlice';
// supabase
import { fetchSupabaseData } from '@/app/utils/supabaseFunk';
// components
import { PagiNation } from '../components/PagiNation';
// css
import '../../sass/product.scss';

// FramerMotion 
import { motion } from 'framer-motion'; 

import { SearchIcon } from '@/public/icons/HeroIcons';
import { ScreenTransition } from '../components/animation/ScreenTransition';

const Product = () => {
  /* state ===========================================*/
  // 商品
  const { productList, totalPrice, selectedCategoryValue, searchWord } =
    useAppSelector((state) => state.product);
  // カテゴリー
  const { categoryList } = useAppSelector((state) => state.category);
  // ページ
  const { page } = useAppSelector((state) => state.page);

  /* redux ===========================================*/
  const dispatch = useAppDispatch();

  /* 変数 ===========================================*/
  // ページネーションの作成　表示可能商品数
  const displayedCount = productList.filter((item) => item.display).length;
  // 商品一覧の画面
  const productRef = useRef<HTMLUListElement>(null);

  /* hooks ===========================================*/
  // 表示件数(商品数はdbより非同期で取得されるため全商品数以上の数字を入力)
  const [perView, setPerView] = useState(1000);
  // 表示ページ開始
  const [startPageNum, setStartPageNum] = useState(0);
  // 表示ページ終了
  const [endPageNum, setEndPageNum] = useState(perView);
  // 現在のページ
  const [activePage, setActivePage] = useState(1);
  // アニメーションを適用させる商品(idで照合)
  const [animationItemId, setAnimationItemId] = useState(0);
  // 選択されている値(selectedCategoryValueはreduxで管理)
  const [categoryValue, setCategoryValue] = useState(selectedCategoryValue);

  // 初回レンダリング
  useEffect(() => {
    // 商品が0であれば
    if (productList.length === 0) {
      // 商品の情報をdbより取得
      dispatch(fetchSupabaseData());
    }
  }, []);

  // totalPriceを更新することでdetail画面に入って戻った時にカートの個数が0にならない。
  useEffect(() => {
    dispatch(calcTotalPrice());
  }, [productList]);

  /* 関数 ===========================================*/

  // 表示する商品の絞り込み
  const selectedProductList = () => {
    return (
      productList
        .filter((item) => item.display)
        .sort((a, b) =>
          sortPrice === 'low' ? a.price - b.price : b.price - a.price,
        )
        // pagination
        .slice(startPageNum, endPageNum)
    );
  };
  // paginationのページへ移動できるとよい
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
    // カテゴリーの名前
    const categoryName = e.target.value;
    // useStateとreduxで管理している理由はカート画面から戻ってきた時に選ばれていたカテゴリーを表示するため
    // state
    setCategoryValue(categoryName);
    // カテゴリー表示
    dispatch(selectedCategory(categoryName));
    // カテゴリーの値
    dispatch(setSelectedCategory(categoryName));

    // カテゴリーと表示件数がすべてなら
    if (categoryName === 'すべて' && page === 'すべて') {
      const productListLength = productList.length;
      setEndPageNum(productListLength);
      setPerView(productListLength);
    } else {
      // それ以外の場合は、現在の表示件数へ
      setEndPageNum(perView);
    }
    // 開始ページを初期化
    setStartPageNum(0);
    // 現在のページを初期化
    setActivePage(1);
    // 検索文字を空にする
    dispatch(searchProduct(''));
  };

  // 商品選択クリック一時中止
  const productCantClick = () => {
    if (productRef.current) {
      // カートに商品を表示する1秒間のanimation中はクリックできないようにする
      productRef.current.style.pointerEvents = 'none';
      const timer = setTimeout(() => {
        if (productRef.current) {
          productRef.current.style.pointerEvents = '';
        }
      }, 1000);
      // クリーンアップ
      return () => clearTimeout(timer);
    }
  };

  // ボタンを沈ませる
  const sinkButton = (id: number) => {
    // クリックしたボタンに該当する商品を選ぶ
    setAnimationItemId(id);
  };

  // 金額による並び替え
  const [sortPrice, setSortPrice] = useState('low');

  /* 関数 ===========================================*/
  // 検索アイコンの有無
  const [isSearchIcon, setIsSearchIcon] = useState(true);

  const inputSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 検索ボックスのアイコン表示非表示
    setIsSearchIcon(e.target.value.length === 0);
    // 検索文字に当てはまる商品表示
    dispatch(searchProduct(e.target.value));
    // 開始ページを初期化
    setStartPageNum(0);
    // 現在のページを初期化
    setActivePage(1);
  };

  return (
    <>
      <ScreenTransition>
      <motion.div className="product"
      initial ={{ opacity: 0 }}
      animate={{opacity: 1}}
      transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="wrap">
          <div className="totalPrice">合計 ¥{totalPrice}</div>
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

        <div className="selectedProduct">
          <select
            onChange={(e) => {
              setSortPrice(e.target.value);
            }}
          >
            <option value="low">安い順</option>
            <option value="high">高い順</option>
          </select>
          <select
            name="category"
            // カテゴリーに合う商品表示
            onChange={handleCategoryChange}
            value={categoryValue}
          >
            {categoryList.map((category, index) => {
              return <option key={index}>{category}</option>;
            })}
          </select>

          <div className="search">
            <input
              type="text"
              className="searchBox"
              value={searchWord}
              onChange={(e) => inputSearchValue(e)}
            />
            <div className="searchBtn">
              {isSearchIcon ? <SearchIcon /> : ''}
            </div>
          </div>
        </div>

        <ul className="productList" ref={productRef}>
          {selectedProductList().map((item) => {
            return (
              <li
                className={`eachProduct ${
                  animationItemId === item.id ? 'isAnimate' : ''
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

                <div className="productBtn">
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
                  買い物カゴへ
                </button>
                <Link href={`/product/${item.name}`}>
                  <button className="detailBtn">詳細</button>
                </Link>

                </div>
              </li>
            );
          })}
        </ul>
      </motion.div>
      </ScreenTransition>
    </>
  );
};
export default Product;
