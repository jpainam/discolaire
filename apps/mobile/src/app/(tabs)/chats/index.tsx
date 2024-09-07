import { ActivityIndicator } from "react-native";

import { Text, View } from "~/components/Themed";

export default function ChatIndex() {
  return (
    <View style={{ flex: 1 }}>
      <Text>Chat index</Text>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    </View>
  );
}
