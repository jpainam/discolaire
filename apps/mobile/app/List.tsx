import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/nativewindui/Text";

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Content</Text>
    </SafeAreaView>
  );
}
