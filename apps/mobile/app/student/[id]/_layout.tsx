import { Text, View } from "react-native";
import { TopTabs } from "@bacons/expo-router-top-tabs";

import { useColorScheme } from "~/lib/useColorScheme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const { colors } = useColorScheme();
  return (
    <TopTabs
      screenOptions={{
        tabBarItemStyle: { width: 100 },
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 12, textTransform: "none" },
        tabBarIndicatorStyle: { backgroundColor: colors.primary },
        tabBarStyle: {
          //backgroundColor: "powderblue",
          //justifyContent: "space-between",
        },
      }}
    >
      <TopTabs.Header>
        <View
          pointerEvents="none"
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 64 / 2,
              backgroundColor: "#D8D8D8",
            }}
          />
          <View style={{ paddingHorizontal: 24 }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 48 }}
              accessibilityRole="header"
            >
              Evan Bacon
            </Text>
            <Text
              style={{ fontSize: 16, opacity: 0.5 }}
              accessibilityRole="header"
            >
              Creator of Expo Router
            </Text>
          </View>
        </View>
      </TopTabs.Header>
      <TopTabs.Screen
        name="index"
        options={{
          title: "Posts",
        }}
      />
      <TopTabs.Screen
        name="Second"
        options={{
          title: "Likes 0",
        }}
      />
      <TopTabs.Screen
        name="Contact"
        options={{
          headerTitleStyle: {
            fontWeight: "bold",
          },
          title: "Likes 1",
        }}
      />
      <TopTabs.Screen
        name="Document"
        options={{
          title: "Likes 2",
        }}
      />
      <TopTabs.Screen
        name="Grade"
        options={{
          title: "Grades 2",
        }}
      />
    </TopTabs>
  );
}
