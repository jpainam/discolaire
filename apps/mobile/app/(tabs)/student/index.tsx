import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { trpc } from "~/utils/api";
import { getFullName } from "~/utils/index";
import { getToken } from "~/utils/session-store";
export default function Page() {
  const studentsQuery = useQuery(trpc.student.all.queryOptions());
  const token = getToken();
  console.log("token", token);
  if (studentsQuery.isLoading) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} />
      </ThemedView>
    );
  }
  const data = studentsQuery.data;

  return (
    <ThemedView>
      <FlashList
        data={data}
        renderItem={({ item }) => {
          return (
            <ThemedView>
              <ThemedText>{getFullName(item)}</ThemedText>
            </ThemedView>
          );
        }}
        estimatedItemSize={200}
      />
    </ThemedView>
  );
}
