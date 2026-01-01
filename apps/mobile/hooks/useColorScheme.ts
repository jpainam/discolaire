import { useColorScheme as useColorSchemeRoot } from "react-native";

export function useColorScheme(): "light" | "dark" {
  const theme = useColorSchemeRoot();
  if (theme === "unspecified") {
    return "light";
  }
  return theme;
}
