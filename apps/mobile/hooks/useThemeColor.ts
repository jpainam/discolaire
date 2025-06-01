/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light,
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

/*** import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
This is for useColorScheme.web.tsx, which is used in the mobile app to support static rendering.
/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
// export function useColorScheme() {
//   const [hasHydrated, setHasHydrated] = useState(false);

//   useEffect(() => {
//     setHasHydrated(true);
//   }, []);

//   const colorScheme = useRNColorScheme();

//   if (hasHydrated) {
//     return colorScheme;
//   }

//   return "light";
// }
