import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";

import { api } from "~/utils/api";

export default function Post() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  if (!id || typeof id !== "string") throw new Error("unreachable");
  const classroomQuery = api.classroom.get.useQuery(id);

  const data = classroomQuery.data;
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: data?.name ?? "" }} />
      <View className="h-full w-full p-4">
        {classroomQuery.isPending && <ActivityIndicator />}
        <Text className="py-2 text-3xl font-bold text-primary">
          {data?.name}
        </Text>
        <Text className="py-4 text-foreground">{data?.shortName}</Text>
      </View>
    </SafeAreaView>
  );
}
