import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { router, Stack, useNavigationContainerRef } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useColorScheme } from "~/hooks/useColorScheme";
import { authClient } from "~/utils/auth";
import { queryClient } from "../utils/api";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // const [loaded] = useFonts({
  //   SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  // });

  const { data: isAuthenticated, isPending } = authClient.useSession();
  const navContainerRef = useNavigationContainerRef();
  const isReady = navContainerRef.isReady();
  useEffect(() => {
    if (!isAuthenticated && isReady) {
      router.push("/auth");
    }
  }, [isAuthenticated, isReady]);

  // if (!loaded) {
  //   // Async font loading only occurs in development.
  //   return null;
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {isPending ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Stack screenOptions={{}}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="auth"
              options={{ headerShown: false, title: "Home" }}
            />
            <Stack.Screen
              name="notifications"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="staff" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        )}
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
