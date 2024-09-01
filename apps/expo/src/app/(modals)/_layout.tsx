import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="SearchStudent"
        options={{ title: "SearchStudent", presentation: "modal" }}
      />
    </Stack>
  );
}
