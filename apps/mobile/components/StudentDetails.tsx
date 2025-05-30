import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function StudentDetails() {
  return (
    <ThemedView>
      {Array.from({ length: 100 }).map((_, index) => (
        <ThemedText key={index} style={{ margin: 10 }}>
          Student Detail {index + 1}
        </ThemedText>
      ))}
      <ThemedView style={{ padding: 20 }}>
        <ThemedText style={{ fontSize: 24, fontWeight: "bold" }}>
          Student Details
        </ThemedText>
      </ThemedView>
      <ThemedText>Student Details</ThemedText>
    </ThemedView>
  );
}
