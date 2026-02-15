import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { Tabs } from "expo-router";
import { Button, Spinner, Surface, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";

import { useProtectedSession } from "@/hooks/use-protected-session";
import { authClient } from "@/utils/auth-client";
import { clearSchoolYearContext } from "@/utils/school-year";

export default function TabLayout() {
  const { session, isPending, error, retry } = useProtectedSession();
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-background">
        <Surface variant="secondary" className="p-6 rounded-lg w-full max-w-sm">
          <View className="items-center gap-3">
            <Spinner size="sm" />
            <Text className="text-muted text-center">
              Preparing your workspace...
            </Text>
          </View>
        </Surface>
      </View>
    );
  }

  if (!session?.user) {
    return <Redirect href="/sign-in" />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-background">
        <Surface variant="secondary" className="p-6 rounded-lg w-full max-w-sm">
          <Text className="text-foreground font-semibold mb-2">
            Session setup failed
          </Text>
          <Text className="text-muted mb-4">{error}</Text>
          <View className="gap-2">
            <Button onPress={() => void retry()}>
              <Button.Label>Retry</Button.Label>
            </Button>
            <Button
              variant="outline"
              onPress={async () => {
                await authClient.signOut();
                await clearSchoolYearContext();
              }}
            >
              <Button.Label>Sign Out</Button.Label>
            </Button>
          </View>
        </Surface>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: themeColorBackground,
        },
        headerTintColor: themeColorForeground,
        headerTitleStyle: {
          color: themeColorForeground,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: themeColorBackground,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="classroom"
        options={{
          headerShown: true,
          title: "Classrooms",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="school" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          headerShown: true,
          title: "Students",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
