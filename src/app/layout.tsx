import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import CartDrawer from '@/components/cart/CartDrawer';
import Toast from '@/components/common/Toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rouniyar Decor | Handcrafted Details for Beautiful Homes',
  description:
    'Discover authentic Indian handmade home decor, woolen door torans, crochet thali posh, brass bell latkans, and festive pooja accessories crafted with love.',
  keywords: [
    'Rouniyar Decor',
    'Handmade Toran',
    'Bandarwal',
    'Door Hangings',
    'Crochet Thali Posh',
    'Pooja Decor',
    'Diwali Toran',
    'Indian Handicrafts',
    'Home Decor India',
  ],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Rouniyar Decor | Handcrafted Indian Home Decor',
    description: 'Artisanal woolen torans, crochet thali posh, and festive pooja essentials.',
    url: 'https://rouniyardecor.com',
    siteName: 'Rouniyar Decor',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rouniyar Decor | Handcrafted Indian Home Decor',
    description: 'Handcrafted Details for Beautiful Homes.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2C1A11] antialiased selection:bg-terracotta selection:text-white">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileBottomNav />
              <CartDrawer />
              <Toast />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
