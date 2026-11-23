import './globals.css';
import { CartProvider } from '../context/CartContext';
import SmoothScroll from '../components/SmoothScroll';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import ToastNotification from '../components/ToastNotification';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';

export const metadata = {
  title: 'GLAZE & CO. | Handcrafted Artisan Donuts & Bakery',
  description: 'A little bit of happiness in every bite. Freshly baked brioche donuts, decadent glazes, craft coffee and treats.',
  keywords: ['donuts', 'bakery', 'artisan donuts', 'chocolate glazed', 'strawberry sprinkle', 'dessert']
};

export const viewport = {
  themeColor: '#FFD900',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,600;1,9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <SmoothScroll>
            <LoadingScreen />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <ToastNotification />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
