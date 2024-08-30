import type { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View } from "./Themed";

const ScreenWrapper = ({ children }: PropsWithChildren) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  return (
    <View
      style={{
        flex: 1,
        paddingTop,
      }}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;
