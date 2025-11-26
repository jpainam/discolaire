import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { StudentListItem } from "~/components/StudentListItem";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useThemeColor } from "~/hooks/useThemeColor";
import { useStudentFilterStore } from "~/stores/student";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";
export default function Screen() {
  const { data: session } = authClient.useSession();
  if (!session) {
    return <Redirect href="/auth/login" />;
  }
  if (session.user.profile === "student") {
    return <OnlyStudent />;
  } else if (session.user.profile === "contact") {
    return <ContactStudent />;
  } else if (session.user.profile === "staff") {
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
  const { query, setQuery } = useStudentFilterStore();

  useEffect(() => {
    return () => {
      setQuery("");
    }; // Clear on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: students,
    isPending,
    isRefetching,
    refetch,
  } = useQuery(trpc.student.all.queryOptions({ query }));

  const borderColor = useThemeColor({}, "border");
  const theme = useColorScheme() ?? "light";

  return (
    <View>
      <FlatList
        style={{ backgroundColor: Colors[theme].background }}
        data={students}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 2,
          paddingBottom: 60,
        }}
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StudentListItem student={item} />}
      />
    </View>
  );
}

function ContactStudent() {
  const {
    data: students,
    isPending,
    isRefetching,
    refetch,
  } = useQuery(trpc.enrollment.all.queryOptions());
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
