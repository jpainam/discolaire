import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";

const Layout = () => {
  const theme = useColorScheme() ?? "light";
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Elève",
          headerStyle: {
            backgroundColor:
              theme === "light"
                ? Colors.light.background
                : Colors.dark.background,
          },
          headerRight: () => {
            return (
              <TouchableOpacity>
                <Ionicons
                  name="calendar"
                  color={
                    theme === "light" ? Colors.light.icon : Colors.dark.icon
                  }
                  size={25}
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

// import { Stack } from "expo-router";
// import { TouchableOpacity } from "react-native";
// import { IconSymbol } from "~/components/ui/IconSymbol";
// import { Colors } from "~/constants/Colors";
// import { useColorScheme } from "~/hooks/useColorScheme";

// export default function Layout() {
//   const theme = useColorScheme() ?? "light";
//   return (
//     <Stack>
//       <Stack.Screen
//         name="index"
//         options={{
//           title: "Student",
//           headerLargeTitle: true,
//           headerTransparent: true,
//           headerBlurEffect: "regular",
//           headerStyle: {
//             backgroundColor:
//               theme === "light"
//                 ? Colors.light.background
//                 : Colors.dark.background,
//           },
//           headerSearchBarOptions: {
//             placeholder: "Search",
//           },
//           headerRight: () => {
//             return (
//               <TouchableOpacity>
//                 <IconSymbol
//                   name="calendar"
//                   color={
//                     theme === "light" ? Colors.light.icon : Colors.dark.icon
//                   }
//                   size={25}
//                 />
//               </TouchableOpacity>
//             );
//           },
//         }}
//       />
//       <Stack.Screen name="profile" options={{ title: "Profile" }} />
//       <Stack.Screen name="settings" options={{ title: "Settings" }} />
//     </Stack>
//   );
// }
