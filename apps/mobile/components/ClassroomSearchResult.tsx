import type { RouterOutputs } from "@repo/api";
import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function ClassroomSearchResult({
  classroom,
}: {
  classroom: RouterOutputs["classroom"]["all"][number];
}) {
  return (
    <Link href={`/classroom/${classroom.id}`} asChild>
      <TouchableOpacity>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.nameText}>{classroom.name}</ThemedText>
          <ThemedText style={styles.sizeText}>
            Effectif: {classroom.size}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: "column",
    //alignItems: "center",
    gap: 2,
  },
  nameText: {
    fontSize: 16,
  },
  sizeText: {
    fontSize: 12,
    color: "#666",
  },
});
