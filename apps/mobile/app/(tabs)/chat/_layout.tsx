import { Stack } from "expo-router";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";

export default function Layout() {
  const theme = useColorScheme() ?? "light";
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Classes",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[theme].background,
          },
          headerSearchBarOptions: {
            placeholder: "Rechercher...",
            hideWhenScrolling: true,
          },
        }}
      />
    </Stack>
  );
}
