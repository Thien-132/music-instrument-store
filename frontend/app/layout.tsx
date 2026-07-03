import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import ChatWidget from "./components/ChatWidget";
import FloatingContacts from "./components/FloatingContacts";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import AmplifyConfig from "./components/AmplifyConfig";
import ConditionalLayout from "./components/ConditionalLayout";
import ClientHeader from "./components/ClientHeader";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Aureate Forest | Premium Saxophone Boutique",
  description: "Nhạc cụ Saxophone chính hãng cao cấp - Aureate Forest. Trải nghiệm âm thanh tuyệt hảo với dịch vụ bảo hành uy tín.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <AmplifyConfig>
          <ToastProvider>
            <CartProvider>
              <ConditionalLayout
              header={
                <ClientHeader />
              }
              chatWidget={
                <>
                  <FloatingContacts />
                  <ChatWidget />
                </>
              }
              footer={
                <footer className="bg-gray-900 text-white py-12 border-t-2 border-yellow-600">
                  <div className="container mx-auto px-6">
                    <div className="grid grid-cols-4 gap-8 mb-8">
                      <div>
                        <h3 className="text-xl font-bold mb-4">AUREATE FOREST</h3>
                        <p className="text-gray-400 mb-4">Chuyên cung cấp Saxophone chính hãng, âm thanh chuẩn mực cho nghệ sĩ chuyên nghiệp.</p>
                        <p className="text-gray-400 text-sm mb-2">📍 TP. Hồ Chí Minh, Việt Nam</p>
                        <p className="text-gray-400 text-sm mb-2">📞 0912 19 12 18</p>
                        <p className="text-gray-400 text-sm">📧 support@nhomtttnmusic.vn</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-4">THÔNG TIN</h4>
                        <ul className="space-y-2 text-gray-400">
                          <li><Link href="/about" className="hover:text-yellow-600">Giới thiệu</Link></li>
                          <li><Link href="#" className="hover:text-yellow-600">Chính sách bảo hành</Link></li>
                          <li><Link href="#" className="hover:text-yellow-600">Chính sách đổi trả</Link></li>
                          <li><Link href="#" className="hover:text-yellow-600">Điều khoản sử dụng</Link></li>
                          <li><Link href="#" className="hover:text-yellow-600">Hướng dẫn mua hàng</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-4">DANH MỤC</h4>
                        <ul className="space-y-2 text-gray-400">
                          <li><Link href="/products?category=Alto%20Saxophone" className="hover:text-yellow-600">Alto Saxophone</Link></li>
                          <li><Link href="/products?category=Tenor%20Saxophone" className="hover:text-yellow-600">Tenor Saxophone</Link></li>
                          <li><Link href="/products?category=Soprano%20Saxophone" className="hover:text-yellow-600">Soprano Saxophone</Link></li>
                          <li><Link href="/products?category=Phụ%20kiện%20Saxophone" className="hover:text-yellow-600">Phụ kiện</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-4">KẾT NỐI</h4>
                        <ul className="space-y-2 text-gray-400">
                          <li><a href="#" className="hover:text-yellow-600">Facebook</a></li>
                          <li><a href="#" className="hover:text-yellow-600">Zalo</a></li>
                          <li><a href="#" className="hover:text-yellow-600">Instagram</a></li>
                          <li><a href="#" className="hover:text-yellow-600">YouTube</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
                      © 2026 AUREATE FOREST | AWS CLOUD PROJECT
                    </div>
                  </div>
                </footer>
              }
            >
              {children}
            </ConditionalLayout>
          </CartProvider>
          </ToastProvider>
        </AmplifyConfig>
      </body>
    </html>
  );
}
