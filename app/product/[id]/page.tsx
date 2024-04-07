"use client";

import { fetchSupabaseData } from "@/lib/features/shopping/slice/ProductSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import Link from "next/link";
import { useEffect } from "react";
// useRouter
import { useRouter } from "next/navigation";

// css
import "@/sass/detail.scss";

// paramsの型
interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const { productList, totalPrice } = useAppSelector((state) => state.product);

  const router = useRouter();

  // リロードしたら商品一覧ページに戻る
  window.addEventListener("load", () => {
    router.push("/");
  });
  



  return (
    <div className="detail">
      <ul>
        {productList
          .filter((item) => item.display && item.name === params.id)
          .map((item) => {
            return (
              <li className="detailItem" key={item.id}>
                {/* <div className="img"> */}
                <img src={`/images/${item.image}`} />
                {/* </div> */}
                <p className="name">{item.name}</p>
                <p className="description"> {item.description}</p>
                <p className="price">¥{item.price}</p>
              </li>
            );
          })}
      </ul>
      <Link href="/product">
        <button className="backBtn">back</button>
      </Link>
    </div>
  );
}
