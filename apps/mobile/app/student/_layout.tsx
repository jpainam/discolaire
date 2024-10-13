import { Stack } from "expo-router";

export default function Layout() {
  //const { colors } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
