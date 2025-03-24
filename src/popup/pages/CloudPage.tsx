import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCloud, IconWifiOff } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { CommonActionIcon } from "~popup/components/CommonActionIcon";
import { EntryList } from "~popup/components/EntryList";
import { NoEntriesOverlay } from "~popup/components/NoEntriesOverlay";
import { useEntries } from "~popup/contexts/EntriesContext";
import { useEntryIdToTags } from "~popup/contexts/EntryIdToTagsContext";
import { useSubscriptionsQuery } from "~popup/hooks/useSubscriptionsQuery";
import { searchAtom } from "~popup/states/atoms";
import db from "~utils/db/react";

export const CloudPage = () => {
  const isMobile = useMediaQuery("(max-width: 450px)");

  const search = useAtomValue(searchAtom);

  const auth = db.useAuth();
  const connectionStatus = db.useConnectionStatus();
  const entries = useEntries();
  const entryIdToTags = useEntryIdToTags();
  const subscriptionsQuery = useSubscriptionsQuery();

  if (auth.user && connectionStatus === "closed") {
    return (
      <EntryList
        noEntriesOverlay={
          <Stack align="center" spacing="xs" p="xl">
            <IconWifiOff size="1.125rem" />
            <Title order={4}>You're Offline</Title>
            <Text size="sm" w={450} align="center">
              Connect to the internet to access Clipboard History IO Pro.
            </Text>
          </Stack>
        }
        entries={[]}
      />
    );
  }

  return (
    <EntryList
      noEntriesOverlay={
        <Stack align="center" spacing="xs" p="xl">
          <Title order={4} align="center">
            You have no items stored in the cloud
          </Title>
          <Text size="sm" w={isMobile ? 300 : 450} align="center">
            Install a Clipboard History IO browser extension to manage your computer's clipboard
            history and store select items in the cloud.
          </Text>
          <Group mt="xs">
            <Button
              color="blue"
              size="xs"
              component="a"
              href="https://chromewebstore.google.com/detail/clipboard-history-io-secu/ombhfdknibjljckajldielimdjcomcek"
              target="_blank"
              fullWidth={isMobile}
            >
              Add to Chrome
            </Button>
            <Button
              color="red"
              size="xs"
              component="a"
              href="https://addons.mozilla.org/en-US/firefox/addon/clipboard-history-io"
              target="_blank"
              fullWidth={isMobile}
            >
              Add to Firefox
            </Button>
          </Group>
        </Stack>
      }
      entries={entries.filter(
        (entry) =>
          entry.id.length === 36 &&
          (search.length === 0 ||
            entry.content.toLowerCase().includes(search.toLowerCase()) ||
            entryIdToTags[entry.id]?.some((tag) => tag.includes(search.toLowerCase()))),
      )}
    />
  );
};
