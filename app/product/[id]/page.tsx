'use client';

// react
import { useAppSelector } from '@/lib/hooks';
// next
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// css
import '@/sass/detail.scss';
import { useEffect } from 'react';

// 型定義 ===========================================
// paramsの型
interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  /* state ===========================================*/
  const { productList } = useAppSelector((state) => state.product);

useEffect(() => {
  // デコードする
  console.log(params.id)
}, [])

  /* hooks ===========================================*/
  const router = useRouter();

  /* 関数 ===========================================*/
  // リロードしたら商品一覧ページに戻る
  window.addEventListener('load', () => {
    router.push('/');
  });

  // スクロール状態を無効化
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="detail">
        <ul>
          {productList
            .filter((item) => item.name === decodeURIComponent (params.id))
            .map((item) => {
              return (
                <li className="detailItem" key={item.id}>
                  <img src={`/images/${item.image}`} />
                  <p className="name">{item.name}</p>
                  <p className="description"> {item.description}</p>
                  <p className="price">¥{item.price}</p>
                </li>
              );
            })}
        </ul>
        <Link href="/product">
          <button className="backBtn">戻る</button>
        </Link>
      </div>
    </>
  );
}
