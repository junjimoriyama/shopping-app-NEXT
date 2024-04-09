import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Header } from "./components/Header";
// import { SupabaseListener } from "./components/SupabaseListener";
// import { Auth } from "./auth/page";

import { useRouter } from 'next/navigation'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "shopping",
  description: "shopping",
};

export default function RootLayout({

  children,
  // ヘッダーの表示
  // showHeader = true
}: Readonly<{
  children: React.ReactNode;
  // showHeader: boolean
}>) {

  return (
    <html lang="ja">
      <body className={inter.className}>
        <StoreProvider>
        <Header />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
