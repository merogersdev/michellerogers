'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Header from './components/Header';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import Footer from './components/Footer';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '500', '700'] });

const metadata: Metadata = {
  title: 'Home',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`${poppins.className} flex flex-col bg-secondary-50`}>
          <Header title="My Portfolio" />
          {children}
          <Footer title="My Portfolio" />
        </body>
      </html>
    </Provider>
  );
}
