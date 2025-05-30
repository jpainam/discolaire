import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useThemeColor } from "~/hooks/useThemeColor";
import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";
export default function Screen() {
  const [search, setSearch] = useState("");
  const { data: students, isPending } = useQuery(
    trpc.student.search.queryOptions({ query: search }),
  );
  const borderColor = useThemeColor({}, "border");
  const theme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Elèves",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
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
            autoFocus: true,
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
        data={students}
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
        renderItem={({ item }) => <StudentItem key={item.id} student={item} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});

function StudentItem({
  student,
}: {
  student: RouterOutputs["student"]["search"][number];
}) {
  console.log("StudentItem", student);
  return (
    <ThemedView>
      <ThemedText>The details of a student</ThemedText>
    </ThemedView>
  );
}
