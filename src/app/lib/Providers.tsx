// Inside Providers.tsx

"use client"; // This tells Next.js to treat this component as a client-side component.

import * as React from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/app/lib/redux/store";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HeroUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="white">
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    </Provider>
  );
}

export default Providers;
