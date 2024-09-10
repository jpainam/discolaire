/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "@bacons/text-decoder/install";

import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { useColorScheme } from "~/components/useColorScheme";
import Colors from "~/constants/Colors";
import { Provider } from "~/providers";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
    PoppinsRegular: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="calendar" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          {/* <Stack.Screen
            name="(modals)"
            options={{ headerShown: false, presentation: "modal" }}
          /> */}
          <Stack.Screen
            name="(modals)/new-chat"
            options={{
              presentation: "modal",
              title: "New Chat",
              headerTransparent: true,
              headerBlurEffect: "regular",
              headerStyle: {
                backgroundColor: Colors.light.background,
              },
              headerRight: () => (
                <Link href={"/(tabs)/chats"} asChild>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.light.lightGray,
                      borderRadius: 20,
                      padding: 4,
                    }}
                  >
                    <Ionicons
                      name="close"
                      color={Colors.light.gray}
                      size={30}
                    />
                  </TouchableOpacity>
                </Link>
              ),
              headerSearchBarOptions: {
                placeholder: "Search name or number",
                hideWhenScrolling: false,
              },
            }}
          />
        </Stack>
      </Provider>
    </ThemeProvider>
  );
}
