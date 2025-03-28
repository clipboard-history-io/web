import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Image,
  rem,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCloud,
  IconExternalLink,
  IconHeart,
  IconHelp,
  IconNews,
  IconSearch,
  IconStar,
} from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { match } from "ts-pattern";

import { Tab } from "~types/tab";
import db from "~utils/db/react";
import { defaultBorderColor } from "~utils/sx";

import { ProBadge } from "./components/cloud/ProBadge";
import { UserActionIcon } from "./components/cloud/UserActionIcon";
import { useCloudEntriesQuery } from "./hooks/useCloudEntriesQuery";
import { useCloudFavoritedEntriesQuery } from "./hooks/useCloudFavoritedEntriesQuery";
import { useCloudTaggedEntriesQuery } from "./hooks/useCloudTaggedEntriesQuery";
import { useSubscriptionsQuery } from "./hooks/useSubscriptionsQuery";
import { AllPage } from "./pages/AllPage";
import { CloudPage } from "./pages/CloudPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { refreshTokenAtom, searchAtom, tabAtom } from "./states/atoms";

export const App = () => {
  // useApp();

  const isMobile = useMediaQuery("(max-width: 450px)");

  const theme = useMantineTheme();

  const [isFloatingPopup] = useState(true);

  const [search, setSearch] = useAtom(searchAtom);
  const [tab, setTab] = useAtom(tabAtom);

  // const clipboardMonitorIsEnabled = useAtomValue(clipboardMonitorIsEnabledAtom);
  // const settings = useAtomValue(settingsAtom);
  // const changelogViewedAt = useAtomValue(changelogViewedAtAtom);
  const refreshToken = useAtomValue(refreshTokenAtom);

  // Preload queries.
  const auth = db.useAuth();
  const connectionStatus = db.useConnectionStatus();
  const cloudEntriesQuery = useCloudEntriesQuery();
  const cloudFavoritedEntriesQuery = useCloudFavoritedEntriesQuery();
  const cloudTaggedEntriesQuery = useCloudTaggedEntriesQuery();
  const subscriptionsQuery = useSubscriptionsQuery();

  // if (clipboardMonitorIsEnabled === undefined || refreshToken === undefined) {
  //   return null;
  // }

  if (refreshToken && connectionStatus !== "closed") {
    if (
      auth.isLoading ||
      cloudEntriesQuery.isLoading ||
      cloudFavoritedEntriesQuery.isLoading ||
      cloudTaggedEntriesQuery.isLoading ||
      subscriptionsQuery.isLoading
    ) {
      return null;
    }
  }

  return (
    <Card h={isFloatingPopup ? "100%" : 600} w={isFloatingPopup ? "100%" : 700} p="sm">
      <Stack h="100%" spacing="sm">
        <Group align="center" position="apart">
          <Group align="center" spacing="xs">
            <Image src="/icon.png" maw={28} />
            <Title order={6}>Clipboard History IO</Title>
            <ProBadge />
          </Group>
          <Group align="center" spacing="xs" grow={false}>
            <Tooltip
              label={
                <Group align="center" spacing={rem(4)} noWrap>
                  <Text fz="xs">Changelog</Text>
                  <IconExternalLink size="0.8rem" />
                </Group>
              }
            >
              <ActionIcon
                variant="light"
                color="indigo.5"
                component="a"
                href="https://github.com/ayoung19/clipboard-history/releases"
                target="_blank"
              >
                <IconNews size="1.125rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={
                <Group align="center" spacing={rem(4)} noWrap>
                  <Text fz="xs">Support Development</Text>
                  <IconExternalLink size="0.8rem" />
                </Group>
              }
            >
              <ActionIcon
                variant="light"
                color="indigo.5"
                component="a"
                href="https://www.clipboardhistory.io/support"
                target="_blank"
              >
                <IconHeart size="1.125rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={
                <Group align="center" spacing={rem(4)} noWrap>
                  <Text fz="xs">Help & Feedback</Text>
                  <IconExternalLink size="0.8rem" />
                </Group>
              }
            >
              <ActionIcon
                variant="light"
                color="indigo.5"
                component="a"
                href="https://chromewebstore.google.com/detail/ombhfdknibjljckajldielimdjcomcek/support"
                target="_blank"
              >
                <IconHelp size="1.125rem" />
              </ActionIcon>
            </Tooltip>
            <Divider orientation="vertical" h={16} sx={{ alignSelf: "inherit" }} />
            {/* <Tooltip label={<Text fz="xs">Floating Mode</Text>} disabled={isFloatingPopup}>
              <ActionIcon
                variant="light"
                color="indigo.5"
                onClick={async () => {
                  await chrome.windows.create({
                    url: chrome.runtime.getURL("popup.html?ref=popup"),
                    type: "popup",
                    height: 600,
                    width: 700,
                  });

                  window.close();
                }}
                disabled={isFloatingPopup}
              >
                <IconPictureInPicture size="1.125rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={<Text fz="xs">Settings</Text>}>
              <ActionIcon
                variant="light"
                color="indigo.5"
                onClick={() =>
                  modals.open({
                    padding: 0,
                    size: "xl",
                    withCloseButton: false,
                    children: <SettingsModalContent />,
                  })
                }
              >
                <IconSettings size="1.125rem" />
              </ActionIcon>
            </Tooltip> */}
            <UserActionIcon />
            {/* <Divider orientation="vertical" h={16} sx={{ alignSelf: "inherit" }} />
            <Switch
              size="md"
              color="indigo.5"
              checked={clipboardMonitorIsEnabled}
              onChange={() => toggleClipboardMonitorIsEnabled()}
            /> */}
          </Group>
        </Group>
        <Group align="center" position="apart">
          <TextInput
            placeholder="Search items or tags"
            icon={<IconSearch size="1rem" />}
            size="xs"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={isMobile ? "100%" : 240}
            sx={{
              ".mantine-Input-input": {
                borderColor: defaultBorderColor(theme),
                "&:focus, &:focus-within": {
                  borderColor: theme.fn.primaryColor(),
                },
              },
            }}
            autoFocus
          />
          <SegmentedControl
            value={tab}
            onChange={(newTab) => setTab(Tab.parse(newTab))}
            size="xs"
            w={isMobile ? "100%" : undefined}
            color={match(tab)
              .with(Tab.Enum.All, () => "indigo.5")
              .with(Tab.Enum.Favorites, () => "yellow.5")
              .with(Tab.Enum.Cloud, () => "cyan.5")
              .exhaustive()}
            data={[
              {
                label: (
                  <Group align="center" position="center" spacing={4} noWrap>
                    <IconCloud size="1rem" />
                    <Text>Cloud</Text>
                  </Group>
                ),
                value: Tab.Enum.Cloud,
              },
              {
                label: (
                  <Group align="center" position="center" spacing={4} noWrap>
                    <IconStar size="1rem" />
                    <Text>Favorites</Text>
                  </Group>
                ),
                value: Tab.Enum.Favorites,
              },
            ]}
          />
        </Group>
        {match(tab)
          .with(Tab.Enum.All, () => <AllPage />)
          .with(Tab.Enum.Favorites, () => <FavoritesPage />)
          .with(Tab.Enum.Cloud, () => <CloudPage />)
          .exhaustive()}
      </Stack>
    </Card>
  );
};
