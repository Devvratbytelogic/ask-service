import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import AppProviders from "@/providers/AppProvider";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", '800', '900'],
  subsets: ["latin"],
  variable: "--font-sans",
});



export const metadata: Metadata = {
  title: "Ask Service",
  description: "Ask for help and let us handle than - Ask Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${inter.variable} antialiased`}
      >
        <AppProviders>
          <Header />
          <div className="min-h-screen">
            {children}
          </div>
          <Footer />
        </AppProviders >
      </body>
    </html>
  );
}
