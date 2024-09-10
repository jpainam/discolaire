import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Classes" }} />
      <Stack.Screen name="create" options={{ title: `Create` }} />
    </Stack>
  );
};

export default Layout;
