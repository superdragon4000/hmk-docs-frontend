import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Providers from '../components/providers';
import SiteHeader from '../components/site-header';

export const metadata: Metadata = {
  title: 'HMK Docs - каталоги HIDROMEK',
  description: 'Платный доступ к PDF-каталогам спецтехники HIDROMEK',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
