import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";

import { api } from "~/utils/api";

export default function Page() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const studentQuery = api.student.get.useQuery(id);
  const student = studentQuery.data;
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen
        options={{ title: student?.lastName ?? student?.firstName ?? "" }}
      />
      {studentQuery.isPending && <ActivityIndicator />}
      <View className="h-full w-full p-4">
        <Text className="py-2 text-3xl font-bold text-primary">{id}</Text>
        {/* <Text className="py-4 text-foreground">{data.content}</Text> */}
      </View>
    </SafeAreaView>
  );
}
