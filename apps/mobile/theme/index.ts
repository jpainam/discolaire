import type { Theme } from "@react-navigation/native";

import { COLORS } from "./colors";

const fonts = {
  regular: {
    fontFamily: "Helvetica Neue",
    fontWeight: "400" as const,
  },
  medium: {
    fontFamily: "Helvetica Neue",
    fontWeight: "500" as const,
  },
  bold: {
    fontFamily: "Helvetica Neue",
    fontWeight: "600" as const,
  },
  heavy: {
    fontFamily: "Helvetica Neue",
    fontWeight: "700" as const,
  },
};
const NAV_THEME: { light: Theme; dark: Theme } = {
  light: {
    dark: false,
    colors: {
      background: COLORS.light.background,
      border: COLORS.light.grey5,
      card: COLORS.light.card,
      notification: COLORS.light.destructive,
      primary: COLORS.light.primary,
      text: COLORS.black,
    },
    fonts: fonts,
  },
  dark: {
    dark: true,
    colors: {
      background: COLORS.dark.background,
      border: COLORS.dark.grey5,
      card: COLORS.dark.grey6,
      notification: COLORS.dark.destructive,
      primary: COLORS.dark.primary,
      text: COLORS.white,
    },
    fonts: fonts,
  },
};

export { NAV_THEME };
