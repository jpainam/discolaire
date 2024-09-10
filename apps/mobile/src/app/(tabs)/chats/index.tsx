import { Loader } from "~/components/Loader";
import { Text, View } from "~/components/Themed";

export default function ChatIndex() {
  return (
    <View style={{ flex: 1 }}>
      <Text>Chat index</Text>
      <Loader />
    </View>
  );
}
