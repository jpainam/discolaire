import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { trpc } from "~/utils/api";

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: classroom, isPending } = useQuery(
    trpc.classroom.get.queryOptions(id)
  );
  return (
    <ThemedView style={styles.container}>
      {isPending && <ActivityIndicator style={styles.loading} size="large" />}
      {!isPending && !classroom ? (
        <></>
      ) : (
        <ThemedView>
          <ThemedText>Details de la classe {id}</ThemedText>
          <ListItem label="Nom" value={classroom?.name} />
          <ListItem label="Niveau" value={classroom?.level.name} />
          <ListItem
            label="Prof Principal"
            value={classroom?.classroomLeader?.lastName}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}

function ListItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <ThemedView style={{ flexDirection: "row", marginVertical: 4 }}>
      <ThemedText style={{ fontWeight: "bold" }}>{label}:</ThemedText>
      <ThemedText style={{ marginLeft: 8 }}>{value}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
