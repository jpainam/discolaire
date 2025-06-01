/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#1e293b", // #11181C
    background: "#f8fafc", //#f7f9fc
    secondaryBackground: "#F1F5F9", // #f7f9fc
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    border: "#EEEEEE",
    gray: "#E1E4E8",
    textSecondary: "#687076",
    cardBackground: "#fff",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    secondaryBackground: "#1E2023",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    border: "#34373B",
    textSecondary: "#9BA1A6",
    textTertiary: "#B1B6BB",
    gray: "#34373B",
    cardBackground: "#1E2023",
  },
};
