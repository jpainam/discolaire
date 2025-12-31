import { Colors } from "~/constants/Colors";

import type { RouterOutputs } from "@repo/api";
import { useColorScheme } from "~/hooks/useColorScheme";
import { getFullName } from "~/utils";
import { Avatar } from "./Avatar";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function StudentProfile({
  student,
}: {
  student: RouterOutputs["student"]["get"];
}) {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView style={{ flex: 1, flexDirection: "column" }}>
      <ThemedView
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <ThemedView style={{ flexDirection: "column", gap: 2 }}>
          <ThemedText type="title">{getFullName(student)}</ThemedText>
          <ThemedText
            style={{
              fontSize: 14,
              color: Colors[theme].textSecondary,
            }}
          >
            {student.dateOfBirth?.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </ThemedText>
          <ThemedText
            style={{ fontSize: 14, color: Colors[theme].textSecondary }}
          >
            {student.classroom ? student.classroom.name : "Not yet registered"}
          </ThemedText>
          <ThemedText>
            {student.gender} followers ·{" "}
            {student.isRepeating ? "Redoublant" : "New Student"}
          </ThemedText>
        </ThemedView>
        <Avatar imageUrl={student.avatar} />
      </ThemedView>
    </ThemedView>
  );
}
