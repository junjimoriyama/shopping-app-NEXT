"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@/public/icons/HeroIcons";
// css
import "../../sass/cart.scss";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchSupabaseData,
  addToCart,
  increaseItem,
  decreaseItem,
  deleteItem,
  totalPrice,
} from "@/lib/features/shopping/slice/ProductSlice";
import React, { useEffect } from "react";
import Link from "next/link";

const Cart = () => {
  const { productList, total } = useAppSelector((state) => state.product);

  const dispatch = useAppDispatch();

  // productListに変化があれば
  useEffect(() => {
    dispatch(totalPrice());
  }, [productList]);

  return (
    <div className="cart">
      <div className="wrap">
      <p className="title">shoppingCart</p>
      <div className="goShopBtn">
        <Link href="/">
          GO SHOP
        </Link>
      </div>
      </div>
      {/* 合計額が0でなければ */}
      {total ? "" : <p className="cartEmpty">Cart is empty.</p>}
      <ul className="cartList">
        {productList
          // amountが1以上の商品のみ表示
          .filter((item) => item.amount >= 1)
          // 追加した順に表示
          .sort((a, b) => b.addedAt - a.addedAt)
          // 各商品の表示
          .map((item) => {
            // もしカゴに入ったら=amountが1以上になったら
            if (item.amount >= 1) {
              return (
                <li key={item.id} className="eachItem">
                  <div className="image">
                    <img src={`../../images/${item.img}`} alt="" />
                  </div>
                  <div className="contents">
                    <div className="name">{item.name}</div>
                    <div className="price">¥{item.price}</div>
                  </div>

                  <div className="count">
                    <div
                      className="countBtn"
                      onClick={() => dispatch(increaseItem(item.id))}
                    >
                      <PlusIcon />
                    </div>
                    <div className="amount">{item.amount}</div>
                    <div
                      className="countBtn"
                      onClick={() => dispatch(decreaseItem(item.id))}
                    >
                      <MinusIcon />

                      <div
                        className="deleteBtn"
                        onClick={() => dispatch(deleteItem(item.id))}
                      >
                        <TrashIcon />
                      </div>
                    </div>
                  </div>
                </li>
              );
            }
          })}
      </ul>

      <hr />

      <div className="total">total: ￥{total}</div>
    </div>
  );
};

export default Cart;
