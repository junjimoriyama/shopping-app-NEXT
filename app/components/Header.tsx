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
import { useParams, usePathname, useRouter } from 'next/navigation';

import { Account } from '@/app/auth/Account';

export const Header = () => {
  // ヘッダーの表示非表示(ページによる)
  const [isShowHeader, setIsShowHeader] = useState(true);
  // ヘッダー内部のメニュー表示非表示(ページによる)
  const [isShowUserMenu, setIsShowUserMenu] = useState(true);

  // パスネーム
  const pathname = usePathname();

  useEffect(() => {
    // ヘッダーの表示非表示
    setIsShowHeader(!pathname.startsWith('/backOffice'))
    // ヘッダーメニューの表示非表示
    setIsShowUserMenu(!(pathname === '/' ||
    pathname.startsWith('/auth')))
  }, [pathname]);

  const {
    productList,
    selectedImg,
    selectedCategoryValue,
    clickCount,
    searchWord,
  } = useAppSelector((state) => state.product);

  // 検索アイコンの有無
  const [isSearchIcon, setIsSearchIcon] = useState(true);

  const dispatch = useAppDispatch();

  // カートに入っている商品数を定義
  let totalAmount = 0;
  // 現在カートに入っている商品数
  productList.forEach((item) => {
    totalAmount += item.amount;
  });

  // カートに入れる画像
  const [addCartImg, setAddCartImg] = useState('');
  // カートに入れる画像のアニメーション発火
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setAddCartImg(selectedImg);
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedImg, clickCount]);

  const inputSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 検索ボックスのアイコン表示非表示
    setIsSearchIcon(e.target.value.length === 0);
    // 検索文字に当てはまる商品表示
    dispatch(searchProduct(e.target.value));
    // setSearchWord(e.target.value)
  };

  return (
    <header className={`${isShowHeader ? 'isVisible' : ''}`}>
      <div className="title">
        <Link href="/product">SUPER MARKET</Link>
      </div>

      <div className={`userMenu ${isShowUserMenu ? 'isVisible' : ''}`}>
        {/* アカウント */}
        <Account />

        <Link href="/backOffice/products/edit">
          <button>edit</button>
        </Link>


        <Logout />

        <div className="wrap">
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
