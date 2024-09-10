import { SafeAreaView } from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";

import { Loader } from "~/components/Loader";
import { useThemeColor } from "~/components/Themed";
import { api } from "~/utils/api";

export default function Page() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const studentQuery = api.student.get.useQuery(id);
  const backgroundColor = useThemeColor({}, "background");
  const student = studentQuery.data;
  return (
    <SafeAreaView
      style={{
        backgroundColor: backgroundColor,
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{ title: student?.lastName ?? student?.firstName ?? "" }}
      />
      {studentQuery.isPending && <Loader />}
    </SafeAreaView>
  );
}
