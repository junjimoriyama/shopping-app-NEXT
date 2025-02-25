'use client';
// react
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// next
import Link from 'next/link';
// redux
import {
  allDeleteItem,
  increaseItem,
  decreaseItem,
  deleteItem,
  calcTotalPrice,
} from '@/lib/features/shopping/slice/ProductSlice';
// icon
import { MinusIcon, PlusIcon, TrashIcon } from '@/public/icons/HeroIcons';
// css
import '../../sass/cart.scss';
import { Modal } from '../components/UI/modal';

const Cart = () => {
  /* state ===========================================*/
  // 商品
  const { productList, totalPrice } = useAppSelector((state) => state.product);

  /* hooks ===========================================*/
  // モーダル表示非表示
  const [isAllDeleteModal, setIsAllDeleteModal] = useState(false);
  // 全削除ボタン
  const [isVisible, setIsVisible] = useState(false);

  /* redux ===========================================*/
  const dispatch = useAppDispatch();

  // 1つでも買い物カゴに入っていたら
  useEffect(() => {
    if (productList.some((item) => item.amount > 0)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [productList]);

  // productListに変化があれば
  useEffect(() => {
    dispatch(calcTotalPrice());
  }, [productList]);

  // スクロール状態を無効化
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="cart">
        <div className="cartTop">
          <p className="title">買い物カゴ</p>
          <div className="goShopBtn">
            <Link href="/product">商品一覧に戻る</Link>
          </div>
        </div>
        {/* 合計額が0でなければ */}
        {totalPrice ? '' : <p className="cartEmpty">カートは空です。</p>}
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

        <div className="cartBottom">
          <div className="total">合計: ￥{totalPrice}</div>
          <div className={`allDelete ${isVisible ? 'isVisible' : ''}`}>
            <button
              className="allDeleteBtn"
              onClick={() => setIsAllDeleteModal(true)}
            >
              すべて削除
            </button>
          </div>
        </div>

        <Modal
          isOpen={isAllDeleteModal}
          onClose={() => setIsAllDeleteModal(false)}
          className="allDeleteModal"
        >
          <p>削除してもいいですか?</p>

          <div className="btnBlock">
            <div
              className="yesBtn"
              onClick={() => {
                dispatch(allDeleteItem());
                setIsAllDeleteModal(false);
              }}
            >
              はい
            </div>
            <div className="noBtn" onClick={() => setIsAllDeleteModal(false)}>
              いいえ
            </div>
          </div>
        </Modal>
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
