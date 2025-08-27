import { Stack } from "expo-router";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useStudentFilterStore } from "~/stores/student";

export default function Layout() {
  const theme = useColorScheme() ?? "light";
  const setQuery = useStudentFilterStore((s) => s.setQuery);
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Elèves",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[theme].background,
          },
          headerSearchBarOptions: {
            placeholder: "Rechercher...",
            hideWhenScrolling: true,
            onChangeText: (text) => {
              setQuery(text.nativeEvent.text);
            },
          },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Détails",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[theme].background,
          },
        }}
      />
    </Stack>
  );
}
