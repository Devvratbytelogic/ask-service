'use client';

import InactivityLogout from "@/components/common/InactivityLogout";
import CommonModal from "@/components/modals/CommonModal";
import appStore from "@/redux/appStore";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { getFcmToken, registerForegroundMessageHandler } from "@/firebase/getFcmTokenn";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: ProvidersProps) {
  useEffect(() => {
    const run = async () => {
      const token = await getFcmToken();
      if (token) {
        await registerForegroundMessageHandler();
      } else {
        console.warn("[FCM] AppProvider: no FCM token (permission denied or unsupported)");
      }
    };
    run();
  }, []);
  return (
    <>
      <Provider store={appStore}>
        <HeroUIProvider>
          <ToastProvider placement="top-right" />
          <NextTopLoader />
          <InactivityLogout />
          {children}
          <CommonModal />
        </HeroUIProvider>
      </Provider>
    </>
  );
}
