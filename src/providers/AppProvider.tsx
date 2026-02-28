'use client';

import CommonModal from "@/components/modals/CommonModal";
import appStore from "@/redux/appStore";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "react-redux";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: ProvidersProps) {
  return (
    <Provider store={appStore}>
      <HeroUIProvider>
        <ToastProvider placement="top-right" />
        <NextTopLoader />
        {children}
        <CommonModal />
      </HeroUIProvider>
    </Provider>
  );
}
