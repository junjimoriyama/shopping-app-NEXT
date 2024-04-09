"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@/public/icons/HeroIcons";
// css
import "../../sass/cart.scss";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchSupabaseData,
  allDeleteItem,
  increaseItem,
  decreaseItem,
  deleteItem,
  calcTotalPrice,
} from "@/lib/features/shopping/slice/ProductSlice";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../components/Header";

const Cart = () => {
  // state
  const { productList, totalPrice } = useAppSelector((state) => state.product);

  // モーダル表示非表示
  const [isAllDeleteModal, setIsAllDeleteModal] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  // 1つでも買い物カゴに入っていたら
  useEffect(() => {
    if (productList.some((item) => item.amount > 0)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [productList]);

  // dispatch
  const dispatch = useAppDispatch();

  // productListに変化があれば
  useEffect(() => {
    dispatch(calcTotalPrice());
  }, [productList]);

  return (
    <>
    <div className="cart">
      <div className="wrap">
        <p className="title">shoppingCart</p>
        <div className="goShopBtn">
          <Link href="/">GO SHOP</Link>
        </div>
      </div>
      {/* 合計額が0でなければ */}
      {totalPrice ? "" : <p className="cartEmpty">Cart is empty.</p>}
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
                    <img src={`../../images/${item.image}`} alt="" />
                  </div>
                  <div className="contents">
                    <div className="name">{item.name}</div>
                    <div className="price">¥{item.price}</div>
                  </div>

                  <div className="amountWrap">
                    <div className="count">
                      <div
                        className="plusBtn"
                        onClick={() => dispatch(increaseItem(item.id))}
                      >
                        <PlusIcon />
                      </div>
                      <div className="amount">{item.amount}</div>
                      <div
                        className="minusBtn"
                        onClick={() => dispatch(decreaseItem(item.id))}
                      >
                        <MinusIcon />
                      </div>
                    </div>
                    <div
                      className="deleteBtn"
                      onClick={() => dispatch(deleteItem(item.id))}
                    >
                      <TrashIcon />
                    </div>
                  </div>
                </li>
              );
            }
          })}
      </ul>

      <hr />

      <div className="total">total: ￥{totalPrice}</div>
      <div className={`allDelete ${isVisible ? "isVisible" : ""}`}>
        <button
          className="allDeleteBtn"
          onClick={() => setIsAllDeleteModal(true)}
        >
          all delete
        </button>
      </div>

      <div
        className={`allDeleteMask ${isAllDeleteModal ? "isOpen" : ""}`}
      ></div>
      <div className={`allDeleteModal ${isAllDeleteModal ? "isOpen" : ""}`}>
        <div className="modalWrap">
          <p>delete everything?</p>
          <div className="buttonBlock">
            <div
              className="yesBtn"
              onClick={() => {
                dispatch(allDeleteItem());
                setIsAllDeleteModal(false);
              }}
            >
              Yes
            </div>
            <div className="noBtn" onClick={() => setIsAllDeleteModal(false)}>
              No
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Cart;

// handleInputChangeの挙動
// ...prevの使用
// ...prevは、editStatesの現在の状態（オブジェクト）をコピーします。これにより、editStatesに含まれるすべてのidとそれに関連するデータ（フィールドと値のペア）を保持しつつ、新しい変更を加えることができます。
// ...prev[id]の使用
// ...prev[id]は、特定のidに対応するオブジェクト内の現在の状態をコピーします。これにより、そのidに既に存在するフィールドと値を保持しつつ、新しいフィールドと値を追加または既存のフィールドを更新することができます。
// 具体的な挙動
// 最初のイベント発生時：editStatesは初期値{}です。...prevは空のオブジェクトを示し、[id]: { [field]: value }により、新しいidとそのfield、valueが追加されます。この時点で...prev[id]は実質的には何も持っていません（idが新しい場合）。
// 2回目以降のイベント発生時：この時、editStatesには最初のイベントで追加されたデータが含まれています。...prevにより、これらのデータを含むオブジェクト全体がコピーされます。もし同じidで異なるフィールドを更新する場合、...prev[id]によりそのidに対応する現在のオブジェクトがコピーされ、新しいfield: valueが追加または更新されます。これにより、同じidの異なるフィールドを独立して更新することができ、以前のフィールドの値は保持されます。
// このように、...prevと...prev[id]を使用することで、複数のidにわたる複数のフィールドを効率的に、かつ安全に更新することができます。