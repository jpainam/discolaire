import { ScrollView } from "react-native";

import { View } from "~/components/Themed";

const Page = () => {
  return (
    <View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 40 }}
      ></ScrollView>
    </View>
  );
};

export default Page;
