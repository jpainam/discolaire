import { Image, Text, TouchableOpacity, View } from "react-native";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useColorScheme } from "~/components/useColorScheme";
import Colors from "~/constants/Colors";

const Layout = () => {
  const theme = useColorScheme() ?? "light";
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Chats",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          headerLeft: () => (
            <TouchableOpacity>
              <Ionicons
                name="ellipsis-horizontal-circle-outline"
                color={Colors[theme].primary}
                size={30}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 30 }}>
              <TouchableOpacity>
                <Ionicons
                  name="camera-outline"
                  color={Colors[theme].primary}
                  size={30}
                />
              </TouchableOpacity>
              <Link href="/" asChild>
                <TouchableOpacity>
                  <Ionicons
                    name="add-circle"
                    color={Colors[theme].primary}
                    size={30}
                  />
                </TouchableOpacity>
              </Link>
            </View>
          ),
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerSearchBarOptions: {
            placeholder: "Search",
          },
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: "",
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                width: 220,
                alignItems: "center",
                gap: 10,
                paddingBottom: 4,
              }}
            >
              <Image
                source={{
                  uri: "https://pbs.twimg.com/profile_images/1564203599747600385/f6Lvcpcu_400x400.jpg",
                }}
                style={{ width: 40, height: 40, borderRadius: 50 }}
              />
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                Simon Grimm
              </Text>
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 30 }}>
              <TouchableOpacity>
                <Ionicons
                  name="videocam-outline"
                  color={Colors[theme].primary}
                  size={30}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  name="call-outline"
                  color={Colors[theme].primary}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            backgroundColor: Colors[theme].background,
          },
        }}
      />
    </Stack>
  );
};
export default Layout;
