"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import "@/sass/header.scss";

import { CartIcon, SearchIcon } from "@/public/icons/HeroIcons";
import { searchProduct } from "@/lib/features/shopping/slice/ProductSlice";
import Link from "next/link";
import { useState } from "react";

export const Header = () => {
  const { productList } = useAppSelector((state) => state.product)

  // 検索アイコンの有無
  const [ isSearch, setIsSearch  ] = useState(true)

  const dispatch = useAppDispatch();

  // カートに入っている商品数を定義
  let totalAmount = 0;
  // 現在カートに入っている商品数
  productList.forEach((item) => {
    totalAmount += item.amount;
  });

  const inputSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 検索ボックスのアイコン表示非表示
    if(e.target.value.length > 0) {
      setIsSearch(false)
    } else {
      setIsSearch(true)
    }
    dispatch(searchProduct(e.target.value));
  };

  return (
    <header>
      <div className="title">
        <Link href="/">SUPER MARKET</Link>
      </div>

      <div className="wrap">
        <div className="search">
          <input
            type="text"
            className="searchBox"
            onChange={(e) => inputSearchValue(e)}
          />
          <div className="searchBtn">
            {isSearch ? <SearchIcon /> : ''}
          </div>
        </div>
        <Link href="/cart">
          <div className="cartIcon">
            <CartIcon />
            {totalAmount > 0 ? (
              <div className="totalAmount">{totalAmount}</div>
            ) : null}
          </div>
        </Link>
      </div>
    </header>
  );
};
