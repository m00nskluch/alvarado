import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Distribuidora Alvarado - Catálogo Oficial',
  description: 'Catálogo de plásticos, aseo, frutas y verduras en Santiago de Chile.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          {children}
          <CartDrawer/>
        </CartProvider>
      </body>
    </html>
  );
}
