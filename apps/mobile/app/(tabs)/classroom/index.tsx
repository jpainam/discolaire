import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { ClassroomSearchResult } from "~/components/ClassroomSearchResult";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useThemeColor } from "~/hooks/useThemeColor";
import { trpc } from "~/utils/api";

export default function Screen() {
  const { data, isPending } = useQuery(trpc.classroom.all.queryOptions());
  const [search, setSearch] = useState("");
  const borderColor = useThemeColor({}, "border");
  const [filteredData, setFilteredData] = useState(data);
  const theme = useColorScheme();
  //const router = useRouter();
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
          headerTitle: "Classes",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,

          //headerTransparent: true,
          //headerBlurEffect: "regular",
          headerStyle: {
            backgroundColor:
              theme === "light"
                ? Colors.light.background
                : Colors.dark.background,
          },
          // headerTitle: (props) => {
          //   return (
          //     <ThemedView style={{ flex: 1, flexDirection: "row" }}>
          //       <ThemedText type="title">{props.children}</ThemedText>
          //     </ThemedView>
          //   );
          // },
          headerSearchBarOptions: {
            placeholder: "Rechercher...",
            onChangeText: (e) => setSearch(e.nativeEvent.text),
            //autoFocus: true,
            hideWhenScrolling: false,
            //onCancelButtonPress: () => {},
          },
          // headerRight: () => {
          //   return (
          //     <TouchableOpacity
          //       onPress={() => {
          //         router.push("/classroom/calendar");
          //       }}
          //     >
          //       <Ionicons
          //         name="calendar"
          //         color={
          //           theme === "light" ? Colors.light.icon : Colors.dark.icon
          //         }
          //         size={25}
          //       />
          //     </TouchableOpacity>
          //   );
          // },
        }}
      />
      <FlatList
        data={filteredData}
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
