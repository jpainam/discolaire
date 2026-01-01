import { ScrollView, View } from "react-native";
import { ThemedText } from "~/components/ThemedText";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";

export default function Screen() {
  //const headerHeight = useHeaderHeight();
  const theme = useColorScheme();
  return (
    <View>
      <ScrollView
        style={{ backgroundColor: Colors[theme].background }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
      >
        {Array.from({ length: 100 }, (_, i) => (
          <ThemedText
            key={i}
            style={{
              fontSize: 16,
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            Chat message {i + 1}
          </ThemedText>
        ))}
      </ScrollView>
    </View>
  );
}
