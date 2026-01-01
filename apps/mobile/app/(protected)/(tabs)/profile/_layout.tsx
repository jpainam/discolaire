import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";

const Layout = () => {
  const theme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        //contentStyle: { backgroundColor: "#fff" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerStyle: {
            backgroundColor: Colors[theme].background,
          },
          headerRight: () => {
            return (
              <TouchableOpacity>
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={Colors[theme].icon}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Stack>
  );
};
export default Layout;
