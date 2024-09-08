import { SafeAreaView, Text, View } from "react-native";
import { useGlobalSearchParams } from "expo-router";

export default function Post() {
  const { id } = useGlobalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="bg-background">
      {/* <Stack.Screen options={{ title: data.title }} /> */}
      <View className="h-full w-full p-4">
        <Text className="py-2 text-3xl font-bold text-primary">{id}</Text>
        {/* <Text className="py-4 text-foreground">{data.content}</Text> */}
      </View>
    </SafeAreaView>
  );
}
