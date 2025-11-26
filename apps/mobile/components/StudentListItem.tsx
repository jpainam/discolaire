import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "~/components/Avatar";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { getFullName } from "~/utils";
import type { RouterOutputs } from "~/utils/api";
export function StudentListItem({
  student,
}: {
  student:
    | RouterOutputs["student"]["all"][number]
    | RouterOutputs["enrollment"]["all"][number];
}) {
  return (
    <Link href={`/student/${student.id}`} asChild>
      <TouchableOpacity>
        <ThemedView style={styles.itemContainer}>
          <Avatar />
          <ThemedView style={{ flex: 1, flexDirection: "column" }}>
            <ThemedText style={{ fontSize: 16, fontWeight: "400" }}>
              {getFullName(student)}
            </ThemedText>
            <ThemedView
              style={{
                flexDirection: "row",
                gap: 4,
                justifyContent: "space-between",
              }}
            >
              {/* <ThemedText
                style={{
                  color: "gray",
                  fontSize: 10,
                  opacity: 0.8,
                }}
              >
                {student.dateOfBirth?.toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </ThemedText> */}
              <ThemedText
                style={{
                  color: "gray",
                  fontSize: 10,
                  opacity: 0.8,
                }}
              >
                {student.classroom?.reportName}
              </ThemedText>
              <ThemedText style={styles.registrationText}>
                {student.registrationNumber}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView></ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </Link>
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
  itemContainer: {
    paddingVertical: 8,
    alignItems: "center",
    //paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
  },
  registrationText: {
    fontSize: 12,
  },
});
