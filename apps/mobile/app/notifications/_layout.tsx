import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Notifications",
          headerLargeTitle: true,
          headerBlurEffect: "regular",
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
    </Stack>
  );
}
