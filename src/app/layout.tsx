import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Distribuidora Alvarado ("Dónde Álvaro") | Catálogo Digital & Pedidos por WhatsApp',
  description: 'Distribuidora comercial en Santiago de Chile. Insumos plásticos, frutas y verduras frescas y artículos de limpieza al por mayor y menor.',
  keywords: 'distribuidora alvarado, donde alvaro, plasticos santiago, frutas y verduras al por mayor, productos de limpieza santiago',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
