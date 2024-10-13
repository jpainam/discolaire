import * as React from "react";
import { Platform, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Icon } from "@roninoss/icons";

import { ActivityIndicator } from "~/components/nativewindui/ActivityIndicator";
import { Button } from "~/components/nativewindui/Button";
import { Text } from "~/components/nativewindui/Text";
import { useColorScheme } from "~/lib/useColorScheme";

export default function ButtonScreen() {
  const { colors } = useColorScheme();
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Button" }} />
      <View className="flex-1 items-center justify-center gap-8">
        <Button>
          <Icon name="play" color="white" size={21} />
          <Text>Primary</Text>
        </Button>
        <Button variant="secondary">
          <Text>Secondary</Text>
        </Button>
        <Button
          onPress={() => {
            setIsLoading((prev) => !prev);
          }}
          variant="tonal"
        >
          {isLoading && (
            <Animated.View entering={FadeIn.delay(200)}>
              <ActivityIndicator size="small" />
            </Animated.View>
          )}
          <Text>Tonal</Text>
        </Button>
        <Button variant="plain">
          <Text>Plain</Text>
        </Button>
        <Button variant="tonal" size="icon">
          <Icon
            name="heart"
            color={Platform.OS === "ios" ? colors.primary : colors.foreground}
            size={21}
          />
        </Button>
      </View>
    </SafeAreaView>
  );
}
