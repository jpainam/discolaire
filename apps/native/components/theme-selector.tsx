import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { GestureResponderEvent } from "react-native";
import { ActionSheetIOS, Alert, Platform, Pressable } from "react-native";
import { withUniwind } from "uniwind";

import { availableThemes, useAppTheme } from "@/contexts/app-theme-context";

const StyledIonicons = withUniwind(Ionicons);

export function ThemeSelector() {
  const { currentThemeOption, setThemeOption } = useAppTheme();

  const applyTheme = (index: number) => {
    const selectedTheme = availableThemes[index];
    // if (!selectedTheme) return;
    setThemeOption(selectedTheme.id);

    if (Platform.OS === "ios") {
      void Haptics.selectionAsync();
    }
  };

  const openThemeSelector = (_event: GestureResponderEvent) => {
    if (Platform.OS === "ios") {
      const options = [...availableThemes.map((theme) => theme.name), "Cancel"];
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: `Theme: ${currentThemeOption.name}`,
          options,
          cancelButtonIndex: options.length - 1,
        },
        (buttonIndex) => {
          if (buttonIndex >= availableThemes.length) return;
          applyTheme(buttonIndex);
        },
      );
      return;
    }

    Alert.alert(
      "Select theme",
      undefined,
      [
        ...availableThemes.map((theme, index) => ({
          text:
            theme.id === currentThemeOption.id
              ? `${theme.name} (current)`
              : theme.name,
          onPress: () => applyTheme(index),
        })),
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  return (
    <Pressable
      onPress={openThemeSelector}
      className="px-2.5"
      accessibilityRole="button"
      accessibilityLabel={`Theme selector, current theme is ${currentThemeOption.name}`}
      hitSlop={8}
    >
      <StyledIonicons
        name="color-palette-outline"
        size={20}
        className="text-foreground"
      />
    </Pressable>
  );
}
