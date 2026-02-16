import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { HeroUINativeProvider } from "heroui-native";
import { useCallback, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { ThemeToggle } from "@/components/theme-toggle";
import { AppThemeProvider, useAppTheme } from "@/contexts/app-theme-context";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { queryClient } from "@/utils/trpc";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export const unstable_settings = {
  initialRouteName: "sign-in",
};

function StackLayout() {
  const { isDark } = useAppTheme();
  const _renderThemeToggle = useCallback(() => <ThemeToggle />, []);
  return (
    <View className="flex-1 bg-background">
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerRight: _renderThemeToggle,
        }}
      >
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="classroom/[id]" />
        <Stack.Screen
          name="modal"
          options={{ title: "Modal", presentation: "modal" }}
        />
        <Stack.Screen
          name="calendar"
          options={{ title: "Calendar", presentation: "modal" }}
        />
      </Stack>
    </View>
  );
}

function BootstrapGate() {
  const { isAuthPending } = useAuth();
  const [fontsLoaded, fontsError] = useFonts({
    // Inter_400Regular,
    // Inter_500Medium,
    // Inter_600SemiBold,
    // Inter_700Bold,
  });

  const isAppReady = !isAuthPending && (fontsLoaded || Boolean(fontsError));

  useEffect(() => {
    if (!isAppReady) return;
    void SplashScreen.hideAsync();
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  return <StackLayout />;
}

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <AppThemeProvider>
            <AuthProvider>
              <HeroUINativeProvider>
                <BootstrapGate />
              </HeroUINativeProvider>
            </AuthProvider>
          </AppThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
