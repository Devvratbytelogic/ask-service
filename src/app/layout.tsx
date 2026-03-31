import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "../styles/globals.css";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import CookieBanner from "@/components/common/CookieBanner/CookieBanner";
import AppProviders from "@/providers/AppProvider";
import { API_BASE_URL } from "@/utils/config";
import { IGlobalSettingsAPIResponse } from "@/types/global";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", '800', '900'],
  subsets: ["latin"],
  variable: "--font-sans",
});

async function getGlobalSettings(): Promise<IGlobalSettingsAPIResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/get-global`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const globalSettings = await getGlobalSettings();
  const iconImage = globalSettings?.data?.icon_image;
  const title = globalSettings?.data?.marketplace_name || "Ask Service";
  const description = globalSettings?.data?.meta_description || "Ask for help and let us handle that - Ask Service";

  return {
    title,
    description,
    ...(iconImage && {
      icons: {
        icon: iconImage,
        shortcut: iconImage,
        apple: iconImage,
      },
    }),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const initialIsAuthenticated = !!authToken;

  return (
    // <html lang="fr" translate="no" className="notranslate">
    <html lang="en">
      <body
        className={` ${inter.variable} antialiased`}
      >
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <Header initialIsAuthenticated={initialIsAuthenticated} />
            {/* <div className="min-h-0 flex-1"> */}
            {children}
            {/* </div> */}
            <Footer />
            <CookieBanner />
          </div>
        </AppProviders >
      </body>
    </html>
  );
}
