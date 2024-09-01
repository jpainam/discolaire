import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen name="create" options={{ title: `Create` }} />
    </Stack>
  );
};

export default Layout;
