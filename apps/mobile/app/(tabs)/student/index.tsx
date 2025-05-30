import { useQuery } from "@tanstack/react-query";
import { Redirect, Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { StudentListItem } from "~/components/StudentListItem";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useThemeColor } from "~/hooks/useThemeColor";
import { useSession } from "~/providers/auth-provider";
import { trpc } from "~/utils/api";
export default function Screen() {
  const { session } = useSession();
  if (!session) {
    return <Redirect href="/login" />;
  }
  if (session.user?.profile === "student") {
    return <OnlyStudent />;
  } else if (session.user?.profile === "contact") {
    return <ContactStudent />;
  } else if (session.user?.profile === "staff") {
    return <SearchStudent />;
  } else {
    return (
      <ThemedView>
        <ThemedText>Vous n'avez pas accès à cette page</ThemedText>
      </ThemedView>
    );
  }
}

function SearchStudent() {
  const [search, setSearch] = useState("");
  const {
    data: students,
    isPending,
    isRefetching,
    refetch,
  } = useQuery(trpc.student.search.queryOptions({ query: search }));

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
          //         name="chatbubbles"
          //         //name={focused ? "calendar" : "calendar-outline"}
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
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
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
                <ThemedText style={styles.emptyText}>Aucun élève</ThemedText>
              )}
            </ThemedView>
          );
        }}
        renderItem={({ item }) => (
          <StudentListItem key={item.id} student={item} />
        )}
      />
    </ThemedView>
  );
}

function ContactStudent() {
  const {
    data: students,
    isPending,
    isRefetching,
    refetch,
  } = useQuery(trpc.student.all.queryOptions());
  const borderColor = useThemeColor({}, "border");

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={students}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
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
                <ThemedText style={styles.emptyText}>Aucun élève</ThemedText>
              )}
            </ThemedView>
          );
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => <StudentListItem student={item} />}
      />
    </ThemedView>
  );
}
function OnlyStudent() {
  return <ThemedView></ThemedView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
  itemContainer: {
    paddingVertical: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
  },
  registrationText: {
    fontSize: 12,
  },
});
