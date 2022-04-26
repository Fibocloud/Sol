import { StoreProvider } from "$/contexts";
import LayoutProvider from "$/layouts";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

function MyApp({ Component, pageProps, router }: AppProps) {
  const preferred = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(preferred);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <>
      <Head>
        <title>FIBO VMM</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme,
              loader: "dots",
              primaryColor: "teal",
              fontFamily: "'JetBrains Mono', monospace",
              fontFamilyMonospace: "'JetBrains Mono', monospace",
              headings: { fontFamily: "'JetBrains Mono', monospace" },
            }}
          >
            <NotificationsProvider autoClose={2000} position="top-center">
              <StoreProvider>
                <ModalsProvider>
                  <LayoutProvider router={router}>
                    <Component {...pageProps} />
                  </LayoutProvider>
                </ModalsProvider>
              </StoreProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
