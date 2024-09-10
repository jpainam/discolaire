import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "~/components/Themed";
import Spacing from "~/constants/Spacing";

interface ClassroomListItemProps {
  name: string;
  size: number;
  id: string;
  maxSize: number;
}
export function ClassroomListItem({
  name,
  id,
  size,
  //maxSize,
}: ClassroomListItemProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/classes/[id]",
          params: { id: id },
        });
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: Spacing,
        }}
      >
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <Text>{name}</Text>
          <Text
            style={{
              fontSize: 12,
              color: "gray",
            }}
          >
            Effectif {size}
          </Text>
          {/* <Text>{maxSize}</Text> */}
        </View>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
}
