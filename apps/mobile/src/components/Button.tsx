import type { TouchableOpacityProps } from "react-native";
import { TouchableOpacity } from "react-native";

import FontSize from "~/constants/FontSize";
import Spacing from "~/constants/Spacing";
import { Text, useThemeColor } from "./Themed";

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;
export function Button({ title, onPress }: ButtonProps) {
  const backgroundColor = useThemeColor({}, "background");
  //const color = useThemeColor({}, "text");
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: Spacing * 2,
        backgroundColor: backgroundColor,
        marginVertical: Spacing * 3,
        borderRadius: Spacing,
        //shadowColor: Colors.primary,
        shadowOffset: {
          width: 0,
          height: Spacing,
        },
        shadowOpacity: 0.3,
        shadowRadius: Spacing,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: FontSize.large,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
