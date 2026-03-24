import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import { LanguageProvider } from "@/context/LanguageContext";

// Upgraded to Cairo font for a superior, modern corporate luxury aesthetic
const cairo = Cairo({ 
  subsets: ["latin", "arabic"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo'
});

export const metadata: Metadata = {
  title: "Cavalry Fleet | أسطول الفرسان",
  description: "Elite Luxury Car Rental Service in Saudi Arabia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className={`${cairo.className} bg-deepblack text-white antialiased`}>
        <LanguageProvider>
          <NavbarWrapper />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
