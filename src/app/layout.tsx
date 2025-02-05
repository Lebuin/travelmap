import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './app.scss';

const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['300', '400'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Travelmap',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>{children}</body>
    </html>
  );
}
