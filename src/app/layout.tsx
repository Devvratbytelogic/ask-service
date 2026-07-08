import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { cookies } from "next/headers";
import "../styles/globals.css";
import Footer from "@/components/common/Footer/Footer";
import CookieBanner from "@/components/common/CookieBanner/CookieBanner";
import AppProviders from "@/providers/AppProvider";
import { API_BASE_URL } from "@/utils/config";
import { IGlobalSettingsAPIResponse } from "@/types/global";
import ConditionalChrome from "@/components/common/ConditionalChrome";
import Header from "@/components/common/Header/Header";
import Script from "next/script";

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
});

async function getGlobalSettings(): Promise<IGlobalSettingsAPIResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/get-global`, {
      cache: "no-store",
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
  const userRole = cookieStore.get("user_role")?.value;
  const isVendor = userRole?.toLowerCase() === "vendor";
  const initialIsAuthenticated = !!authToken;
  const globalSettings = await getGlobalSettings();
  const logoUrl = globalSettings?.data?.logo;
  const logoDarkUrl = globalSettings?.data?.footer_logo;
  const vendorLogoUrl = globalSettings?.data?.vendor_logo;
  const vendorLogoDarkUrl = globalSettings?.data?.vendor_dark_logo;
  const footerLogoUrl = globalSettings?.data?.footer_logo;
  const platformDescription = globalSettings?.data?.platformDescription;
  const marketplaceName = globalSettings?.data?.marketplace_name;

  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${bricolageGrotesque.variable} font-sans antialiased`}
      >
         <Script
          id="google-translate-dom-patch"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if (typeof Node === 'undefined' || !Node.prototype) return;

                var removeChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function (child) {
                  if (child.parentNode !== this) return child;
                  return removeChild.apply(this, arguments);
                };

                var insertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function (newNode, referenceNode) {
                  if (referenceNode && referenceNode.parentNode !== this) {
                    return this.appendChild(newNode);
                  }
                  return insertBefore.apply(this, arguments);
                };
              })();
            `,
          }}
        />
        <AppProviders>
          <div className="flex min-h-screen flex-col bg-appBg text-appText">
            <ConditionalChrome>
              <Header logoUrl={logoUrl || ""} logoDarkUrl={logoDarkUrl || ""} vendorLogoUrl={vendorLogoUrl || ""} vendorLogoDarkUrl={vendorLogoDarkUrl || ""} isVendor={isVendor} isAuthenticated={initialIsAuthenticated} />
            </ConditionalChrome>
            {children}
            <ConditionalChrome>
              <Footer footerLogoUrl={footerLogoUrl || ""} platformDescription={platformDescription || ""} marketplaceName={marketplaceName || ""} />
            </ConditionalChrome>
            <CookieBanner />
          </div>
        </AppProviders >
      </body>
    </html>
  );
}
