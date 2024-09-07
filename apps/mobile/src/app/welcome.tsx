import { Dimensions, ImageBackground } from "react-native";

import ScreenWrapper from "~/components/ScreenWrapper";
import { Text } from "~/components/Themed";

const { height } = Dimensions.get("window");

const Welcome = () => {
  return (
    <ScreenWrapper>
      <ImageBackground
        resizeMode="contain"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        source={require("~/../assets/images/welcome-img.png")}
        style={{ width: "100%", height: height / 2.5 }}
      />
      <Text>Welcome page</Text>
    </ScreenWrapper>
  );
};

export default Welcome;
