import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ActivityIndicator } from "react-native";
import { AppProviders } from "~/components/Providers";
import { useColorScheme } from "~/hooks/useColorScheme";
import { authClient } from "~/utils/auth";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { data: isAuthenticated, isPending } = authClient.useSession();

  // 🌀 Optional loading state
  if (isPending) {
    return (
      <ActivityIndicator
        size="large"
        color={colorScheme === "dark" ? "#fff" : "#000"}
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  // 🔐 Redirect to /auth if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <AppProviders>
      <Stack screenOptions={{}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="staff" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AppProviders>
  );
}
