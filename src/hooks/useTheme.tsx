import type { MantineThemeOverride } from "@mantine/core";

import { useColorScheme } from "@mantine/hooks";

export const useTheme = () => {
  const systemColorScheme = useColorScheme();

  const theme: MantineThemeOverride = {
    colorScheme: systemColorScheme,
    cursorType: "pointer",
    black: "#343a40", // gray.8
    primaryColor: "indigo",
    primaryShade: { light: 3, dark: 7 },
    colors: {
      // Change dark.0 to gray.3, keep the rest.
      dark: [
        "#dee2e6",
        "#A6A7AB",
        "#909296",
        "#5c5f66",
        "#373A40",
        "#2C2E33",
        "#25262b",
        "#1A1B1E",
        "#141517",
        "#101113",
      ],
    },
  };

  return theme;
};
