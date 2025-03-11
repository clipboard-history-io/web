import "~styles/globals.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import type { AppProps } from "next/app";
import Head from "next/head";

import { AllTagsProvider } from "~popup/contexts/AllTagsContext";
import { EntriesProvider } from "~popup/contexts/EntriesContext";
import { EntryIdToTagsProvider } from "~popup/contexts/EntryIdToTagsContext";
import { FavoriteEntryIdsProvider } from "~popup/contexts/FavoriteEntryIdsContext";
import { useTheme } from "~popup/hooks/useTheme";

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Clipboard History IO</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <EntriesProvider>
          <FavoriteEntryIdsProvider>
            <EntryIdToTagsProvider>
              <AllTagsProvider>
                <ModalsProvider>
                  <Notifications position="top-right" />
                  <Component {...pageProps} />
                </ModalsProvider>
              </AllTagsProvider>
            </EntryIdToTagsProvider>
          </FavoriteEntryIdsProvider>
        </EntriesProvider>
      </MantineProvider>
    </>
  );
}
