import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { cookies } from "next/headers";
import "../styles/globals.css";
import Footer from "@/components/common/Footer/Footer";
import CookieBanner from "@/components/common/CookieBanner/CookieBanner";
import AppProviders from "@/providers/AppProvider";
import ConditionalChrome from "@/components/common/ConditionalChrome";
import Header from "@/components/common/Header/Header";
import Script from "next/script";
import { getGlobalSettings } from "@/utils/getGlobalSettings";

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
});



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
  const isClient = cookieStore.get("is_client")?.value === "true";
  // Vendors keep role=Vendor; is_client toggles client vs prestataire view
  const isVendor = userRole?.toLowerCase() === "vendor" && !isClient;
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
    <html lang="fr" translate="no" suppressHydrationWarning>
      <body
        className={`${bricolageGrotesque.variable} font-sans antialiased`}
      >
        {/*
          Google Translate / Chrome Translate mutates text nodes and breaks React DOM ops.
          Patch before hydration so removeChild/insertBefore/replaceChild don't crash the app.
        */}
        <Script
          id="google-translate-dom-patch"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if (typeof Node === 'undefined' || !Node.prototype) return;
                if (Node.prototype.__askServiceTranslatePatched) return;
                Node.prototype.__askServiceTranslatePatched = true;

                var removeChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function (child) {
                  if (child.parentNode !== this) {
                    if (child.parentNode) {
                      try { return removeChild.call(child.parentNode, child); } catch (e) {}
                    }
                    return child;
                  }
                  return removeChild.apply(this, arguments);
                };

                var insertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function (newNode, referenceNode) {
                  if (referenceNode && referenceNode.parentNode !== this) {
                    if (referenceNode.parentNode) {
                      try {
                        return insertBefore.call(referenceNode.parentNode, newNode, referenceNode);
                      } catch (e) {}
                    }
                    return this.appendChild(newNode);
                  }
                  return insertBefore.apply(this, arguments);
                };

                var replaceChild = Node.prototype.replaceChild;
                Node.prototype.replaceChild = function (newChild, oldChild) {
                  if (oldChild.parentNode !== this) {
                    if (oldChild.parentNode) {
                      try { return replaceChild.call(oldChild.parentNode, newChild, oldChild); } catch (e) {}
                    }
                    return oldChild;
                  }
                  return replaceChild.apply(this, arguments);
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
        </AppProviders>
      </body>
    </html>
  );
}
