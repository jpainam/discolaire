import { Button, Pressable, ScrollView, Text, View } from "react-native";
import { Link, Stack } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Icon } from "@roninoss/icons";

import { useColorScheme } from "~/lib/useColorScheme";

export default function Screen() {
  const { colorScheme, colors } = useColorScheme();
  const { showActionSheetWithOptions } = useActionSheet();
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" className="p-4">
      <Stack.Screen
        options={{
          title: "School system",
          headerSearchBarOptions: {
            hideWhenScrolling: false,
          },
          headerLargeTitle: true,
          headerRight() {
            return (
              <Link href="/modal" asChild>
                <Pressable className="opacity-80 active:opacity-40">
                  <View className="opacity-90">
                    <Icon name="cog-outline" color={colors.foreground} />
                  </View>
                </Pressable>
              </Link>
            );
          },
        }}
      />
      <View className="gap-4 rounded-xl border border-border bg-card p-4 pb-6 shadow-sm shadow-black/10 dark:shadow-none">
        <Text className="text-center text-sm font-medium tracking-wider text-foreground opacity-60">
          Action Sheet
        </Text>

        <Button
          color="grey"
          onPress={() => {
            const options = ["Delete", "Save", "Cancel"];
            const destructiveButtonIndex = 0;
            const cancelButtonIndex = 2;

            showActionSheetWithOptions(
              {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
                containerStyle: {
                  backgroundColor: colorScheme === "dark" ? "black" : "white",
                },
                textStyle: {
                  color: colors.foreground,
                },
              },
              (selectedIndex) => {
                switch (selectedIndex) {
                  case 1:
                    // Save
                    break;

                  case destructiveButtonIndex:
                    // Delete
                    break;

                  case cancelButtonIndex:
                  // Canceled
                }
              },
            );
          }}
          title="Open action sheet"
        />
      </View>
    </ScrollView>
  );
}
