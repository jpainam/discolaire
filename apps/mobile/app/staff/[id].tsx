import { useGlobalSearchParams } from "expo-router";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";

export default function Screen() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  console.log("Staff ID:", id);
  return (
    <ThemedView>
      <ThemedText>Details des eleves</ThemedText>
    </ThemedView>
  );
}
