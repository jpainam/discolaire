import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";

export default function Screen() {
  return (
    <ThemedView>
      <ThemedText>
        Fetch classroom calendar, and forward event to a calendar component
      </ThemedText>
    </ThemedView>
  );
}
