import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { useProtectedSession } from "@/hooks/use-protected-session";

function Modal() {
  const { session, isPending, error, retry } = useProtectedSession();
  const accentForegroundColor = useThemeColor("accent-foreground");

  function handleClose() {
    router.back();
  }

  if (isPending) {
    return (
      <Container isScrollable={false}>
        <View className="flex-1 justify-center items-center p-4">
          <Surface variant="secondary" className="p-5 w-full max-w-sm rounded-lg">
            <Text className="text-muted text-center">
              Loading protected content...
            </Text>
          </Surface>
        </View>
      </Container>
    );
  }

  if (!session?.user) {
    return <Redirect href="/sign-in" />;
  }

  if (error) {
    return (
      <Container isScrollable={false}>
        <View className="flex-1 justify-center items-center p-4">
          <Surface variant="secondary" className="p-5 w-full max-w-sm rounded-lg">
            <Text className="text-foreground font-medium mb-2">
              Session setup failed
            </Text>
            <Text className="text-muted mb-4">{error}</Text>
            <Button onPress={() => void retry()}>
              <Button.Label>Retry</Button.Label>
            </Button>
          </Surface>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <View className="flex-1 justify-center items-center p-4">
        <Surface variant="secondary" className="p-5 w-full max-w-sm rounded-lg">
          <View className="items-center">
            <View className="w-12 h-12 bg-accent rounded-lg items-center justify-center mb-3">
              <Ionicons
                name="checkmark"
                size={24}
                color={accentForegroundColor}
              />
            </View>
            <Text className="text-foreground font-medium text-lg mb-1">
              Modal Screen
            </Text>
            <Text className="text-muted text-sm text-center mb-4">
              This is an example modal screen for dialogs and confirmations.
            </Text>
          </View>
          <Button onPress={handleClose} className="w-full" size="sm">
            <Button.Label>Close</Button.Label>
          </Button>
        </Surface>
      </View>
    </Container>
  );
}

export default Modal;
