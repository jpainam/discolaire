/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export interface BoxedIconProps {
  name: typeof Ionicons.defaultProps;
  backgroundColor: string;
}

const BoxedIcon = ({ name, backgroundColor }: BoxedIconProps) => {
  return (
    <View style={{ backgroundColor, padding: 2, borderRadius: 4 }}>
      <Ionicons name={name} size={15} color={"#fff"} />
    </View>
  );
};
export default BoxedIcon;
