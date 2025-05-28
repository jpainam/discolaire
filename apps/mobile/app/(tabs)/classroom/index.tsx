import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { ClassroomSearchResult } from "~/components/ClassroomSearchResult";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { useThemeColor } from "~/hooks/useThemeColor";
import { trpc } from "~/utils/api";

export default function Screen() {
  const { data, isPending } = useQuery(trpc.classroom.all.queryOptions());
  const [search, setSearch] = useState("");
  const borderColor = useThemeColor({}, "border");
  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    if (!data) return;
    if (search.trim() === "") {
      setFilteredData(data);
      return;
    }
    const lowerSearch = search.toLowerCase();
    const filtered = data.filter((classroom) =>
      classroom.name.toLowerCase().includes(lowerSearch),
    );
    setFilteredData(filtered);
  }, [data, search]);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Classes",
          headerTitle: (props) => {
            return (
              <ThemedView style={{ flex: 1, flexDirection: "row" }}>
                <ThemedText type="title">{props.children}</ThemedText>
              </ThemedView>
            );
          },
          headerSearchBarOptions: {
            placeholder: "Rechercher...",
            onChangeText: (e) => setSearch(e.nativeEvent.text),
            autoFocus: true,
            hideWhenScrolling: false,
            //onCancelButtonPress: () => {},
          },
        }}
      />
      <FlatList
        data={filteredData}
        contentInsetAdjustmentBehavior="automatic"
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
        renderItem={({ item }) => (
          <ClassroomSearchResult key={item.id} classroom={item} />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
