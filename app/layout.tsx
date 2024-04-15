
// next
import type { Metadata } from 'next';
// redux
import StoreProvider from './StoreProvider';
// components
import { Header } from './components/Header';
// font
import { Inter } from 'next/font/google';
// css
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'shopping',
  description: 'shopping',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
