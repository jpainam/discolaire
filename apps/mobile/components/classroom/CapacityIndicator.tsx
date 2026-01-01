import { View } from "react-native";
import * as Progress from "react-native-progress";

interface CapacityIndicatorProps {
  current: number;
  max: number;
}

export default function CapacityIndicator({
  current,
  max,
}: CapacityIndicatorProps) {
  const ratio = current / max;
  let color = "#34C759";

  if (ratio >= 0.9) {
    color = "#FF3B30";
  } else if (ratio >= 0.75) {
    color = "#FFCC00";
  }

  return (
    <View style={{ position: "relative" }}>
      <Progress.Bar
        progress={ratio}
        width={null}
        height={4}
        color={color}
        unfilledColor={"#F5F5F5"}
        borderWidth={0}
        borderRadius={10}
      />
    </View>
  );
}
