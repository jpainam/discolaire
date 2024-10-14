import { TopTabs } from "@bacons/expo-router-top-tabs";

import { useColorScheme } from "~/lib/useColorScheme";
import { Detail } from "./Detail";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const { colors } = useColorScheme();
  return (
    <TopTabs
      screenOptions={{
        tabBarItemStyle: { width: 120 },
        tabBarScrollEnabled: true,
        tabBarShowIcon: true,
        tabBarLabelStyle: { fontSize: 16, textTransform: "none" },
        tabBarIndicatorStyle: { backgroundColor: colors.primary },
        tabBarStyle: {
          //backgroundColor: "powderblue",
          //justifyContent: "space-between",
        },
      }}
    >
      <TopTabs.Header>
        <Detail />
      </TopTabs.Header>
      <TopTabs.Screen
        name="index"
        options={{
          title: "Overview",
        }}
      />
      <TopTabs.Screen
        name="Document"
        options={{
          title: "Documents",
        }}
      />
      <TopTabs.Screen
        name="Contact"
        options={{
          title: "Likes 1",
        }}
      />
      <TopTabs.Screen
        name="Second"
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
