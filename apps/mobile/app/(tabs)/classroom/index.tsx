import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { ClassroomSearchResult } from "~/components/ClassroomSearchResult";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useThemeColor } from "~/hooks/useThemeColor";
import { useClassroomFilterStore } from "~/stores/classroom";
import { trpc } from "~/utils/api";

export default function Screen() {
  const { data, isPending, isRefetching, refetch } = useQuery(
    trpc.classroom.all.queryOptions(),
  );
  const { query, setQuery } = useClassroomFilterStore();
  const theme = useColorScheme() ?? "light";
  const borderColor = useThemeColor({}, "border");
  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    return () => setQuery(""); // Clear on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data) return;
    if (query.trim() === "") {
      setFilteredData(data);
      return;
    }
    const lowerSearch = query.toLowerCase();
    const filtered = data.filter((classroom) =>
      classroom.name.toLowerCase().includes(lowerSearch),
    );
    setFilteredData(filtered);
  }, [data, query]);

  return (
    <View>
      <FlatList
        style={{ backgroundColor: Colors[theme].background }}
        data={filteredData}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 60 }} // Adjust based on your tab bar height
        ItemSeparatorComponent={() => (
          <ThemedView
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: borderColor,
            }}
          ></ThemedView>
        )}
        ListEmptyComponent={() => {
          return (
            <ThemedView>
              {isPending ? (
                <ActivityIndicator size={"large"} />
              ) : (
                <ThemedText style={styles.emptyText}>Aucune classe</ThemedText>
              )}
            </ThemedView>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ClassroomSearchResult classroom={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 16,
    marginTop: 20,
  },
});
