import type { ColorValue, TextInputProps, ViewStyle } from "react-native";
import React from "react";
import { TextInput } from "react-native";

import type { ThemeProps } from "./Themed";
import Colors from "~/constants/Colors";
import { useThemeColor, View } from "./Themed";
import { useColorScheme } from "./useColorScheme";

type Props = ThemeProps &
  TextInputProps & {
    containerStyle?: ViewStyle;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    backgroundColor?: ColorValue;
    borderColor?: ColorValue;
    borderWidth?: number;
    borderRadius?: number;
  };

const Input: React.FC<Props> = React.forwardRef(
  (props: Props, ref: unknown) => {
    const {
      style,
      lightColor,
      darkColor,
      containerStyle,
      leftContent,
      rightContent,
      borderWidth = containerStyle?.borderWidth ?? 1,
      borderRadius = containerStyle?.borderRadius ?? 8,
      ...otherProps
    } = props;

    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const theme = useColorScheme() ?? "light";
    const borderColor = Colors[theme].borderColor;
    const placeholderColor = Colors[theme].placeholderColor;

    return (
      <View
        style={{
          borderColor: borderColor,
          borderWidth: borderWidth,
          borderRadius: borderRadius,
          flexDirection: containerStyle?.flexDirection ?? "row",
          paddingHorizontal: containerStyle?.paddingHorizontal ?? 20,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {leftContent}
        <TextInput
          {...otherProps}
          //@ts-expect-error TODO   fix this
          ref={ref}
          style={[
            {
              color,
              flex: 1,
              marginLeft: leftContent ? 5 : 0,
              marginRight: rightContent ? 5 : 0,
              paddingVertical: 10,
            },
            style,
          ]}
          placeholderTextColor={placeholderColor}
        />
        {rightContent}
      </View>
    );
  },
);
export default Input;
