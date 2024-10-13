import "expo-dev-client";
import "../global.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
// import { Icon } from "@roninoss/icons";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";

import { useColorScheme, useInitialAndroidBarSync } from "~/lib/useColorScheme";
import { NAV_THEME } from "~/theme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? "light" : "dark"}`}
        style={isDarkColorScheme ? "light" : "dark"}
      />
      {/* WRAP YOUR APP WITH ANY ADDITIONAL PROVIDERS HERE */}
      {/* <ExampleProvider> */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ActionSheetProvider>
            <NavThemeProvider value={NAV_THEME[colorScheme]}>
              <Stack
                screenOptions={{
                  animation: "ios", // for android
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="student" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="welcome"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
            </NavThemeProvider>
          </ActionSheetProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>

      {/* </ExampleProvider> */}
    </>
  );
}
