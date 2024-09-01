import React from "react";
import { Pressable } from "react-native";
import { Link, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useClientOnlyValue } from "~/components/useClientOnlyValue";
import { useColorScheme } from "~/components/useColorScheme";
import Colors from "~/constants/Colors";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  //const segments = useSegments();

  //const shouldShowTabBar = !segments.includes("[id]");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        //tabBarStyle: { display: shouldShowTabBar ? "flex" : "none" },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="calendar"
                    // <FontAwesome
                    // name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="chatbubbles" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="apps" color={color} />,
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="people" color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
