"use client";

import Product from "./product/page";
import Cart from "./cart/page";
import { useRouter } from "next/router";
import { Header } from "./components/Header";

function Home() {

  return (
    <>
      <Product />
    </>
  );
}

export default Home;
