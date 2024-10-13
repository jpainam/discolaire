import { Linking, Platform, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Icon } from "@roninoss/icons";

import { Text } from "~/components/nativewindui/Text";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useColorScheme } from "~/lib/useColorScheme";

export default function ModalScreen() {
  const { colors, colorScheme } = useColorScheme();
  return (
    <>
      <Stack.Screen
        options={{
          presentation: "modal",
          animation: "fade_from_bottom", // for android
          title: "Settings",
          headerRight: () => <ThemeToggle />,
        }}
      />
      <StatusBar
        style={
          Platform.OS === "ios"
            ? "light"
            : colorScheme === "dark"
              ? "light"
              : "dark"
        }
      />
      <View className="flex-1 items-center justify-center gap-1 px-12">
        <Icon name="file-plus-outline" size={42} color={colors.grey} />
        <Text variant="title3" className="pb-1 text-center font-semibold">
          NativeWindUI
        </Text>
        <Text color="tertiary" variant="subhead" className="pb-4 text-center">
          You can install any of the free components from the{" "}
          <Text
            onPress={() => Linking.openURL("https://nativewindui.com")}
            variant="subhead"
            className="text-primary"
          >
            NativeWindUI
          </Text>
          {" website."}
        </Text>
      </View>
    </>
  );
}
