'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// import { UserButton } from "./auth/UserButton";

// css
import '@/sass/header.scss';

import { CartIcon, SearchIcon } from '@/public/icons/HeroIcons';
import { searchProduct } from '@/lib/features/shopping/slice/ProductSlice';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Logout } from '../auth/logout/Logout';
import { usePathname } from 'next/navigation';
import { getSession } from '../auth/session';
// icon
import { AdminIcon } from '@/public/icons/HeroIcons';


export const Header = () => {
  /* state ===========================================*/
  // 商品
  const { productList, selectedImg, clickCount, searchWord } = useAppSelector(
    (state) => state.product,
  );
  // ユーザー
  const { isAdmin, userName } = useAppSelector((state) => state.user);
  // 管理者
  // const { adminId } = useAppSelector((state) => state.admin);

  /* redux ===========================================*/
  const dispatch = useAppDispatch();

  /* 変数 ===========================================*/
  // パスネーム
  const pathname = usePathname();

  /* hooks ===========================================*/
  // ヘッダーの表示非表示(ページによる)
  const [isShowHeader, setIsShowHeader] = useState(true);
  // ヘッダー内部のメニュー表示非表示(ページによる)
  const [isShowUserMenu, setIsShowUserMenu] = useState(true);
  // 検索アイコンの有無
  const [isSearchIcon, setIsSearchIcon] = useState(true);
  // カートに入れる画像
  const [addCartImg, setAddCartImg] = useState('');
  // カートに入れる画像のアニメーション発火
  const [isVisible, setIsVisible] = useState(false);

  // カートに入っている商品数を定義
  let totalAmount = 0;
  // 現在カートに入っている商品数
  productList.forEach((item) => {
    totalAmount += item.amount;
  });


  useEffect(() => {
    // ヘッダーの表示非表示
    setIsShowHeader(!pathname.startsWith('/backOffice'));
    // ヘッダーメニューの表示非表示
    setIsShowUserMenu(!(pathname === '/' || pathname.startsWith('/auth')));
  }, [pathname]);

  // ユーザー画像の配置
  useEffect(() => {
    setAddCartImg(selectedImg);
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedImg, clickCount]);

  return (
    <header className={`${isShowHeader ? 'isVisible' : ''}`}>
      <div className="title">
        <Link href="/product">SUPER MARKET</Link>
      </div>

      <div className={`userMenu ${isShowUserMenu ? 'isVisible' : ''}`}>
        {/* アカウント */}
        {/* <Account /> */}

        {/* 管理者idとセッションidが一緒なら */}
        {isAdmin ? (
          <div className="adminBtn">
          <Link href="/backOffice/products/edit">
            <AdminIcon />
            {/* <button>edit</button> */}
          </Link>
          </div>
        ) : null }
        <Logout />

        <div className="wrap">
          <Link href="/cart">
            <div className="cartIcon">
              <CartIcon />
              {totalAmount > 0 ? (
                <div className="totalAmount">{totalAmount}</div>
              ) : null}
              {addCartImg && (
                <img
                  className={`addCartImg ${isVisible ? 'animate' : ''}`}
                  src={`images/${addCartImg}`}
                  alt=""
                />
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* <UserButton/> */}
    </header>
  );
};
