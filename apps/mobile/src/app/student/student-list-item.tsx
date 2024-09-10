import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "~/components/Themed";
import Spacing from "~/constants/Spacing";

interface StudentListItemProps {
  id: string;
  name: string;
  //avatar: string;
  dateOfBirth?: Date | null;
}
export function StudentListItem({
  id,
  name,
  dateOfBirth,
}: StudentListItemProps) {
  const dateFormatter = Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/student/[id]",
          params: { id: id },
        });
      }}
    >
      <View
        style={{
          flexDirection: "row",
          padding: Spacing,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <Text>{name}</Text>
          {dateOfBirth && (
            <Text
              style={{
                fontSize: 12,
                color: "gray",
              }}
            >
              {dateFormatter.format(dateOfBirth)}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
}
