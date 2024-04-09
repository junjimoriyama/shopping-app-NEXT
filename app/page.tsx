"use client";

import Product from "./product/page";
import Cart from "./cart/page";
import { Header } from "./components/Header";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Auth from "./auth/page";

function Home() {

  return (
    
    <>
      <Auth />
    </>
  );
}

export default Home;
