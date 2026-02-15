import { Redirect } from "expo-router";
import { Spinner, Surface } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { authClient } from "@/utils/auth-client";

export default function SignInScreen() {
  const { data: session, isPending } = authClient.useSession();

  if (session?.user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Container className="p-6" isScrollable={false}>
      <View className="flex-1 justify-center">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Discolaire
          </Text>
          <Text className="text-muted">
            Sign in to access your school workspace.
          </Text>
        </View>

        {isPending ? (
          <Surface variant="secondary" className="p-6 rounded-lg">
            <View className="items-center gap-3">
              <Spinner size="sm" />
              <Text className="text-muted">Checking session...</Text>
            </View>
          </Surface>
        ) : (
          <SignIn />
        )}
      </View>
    </Container>
  );
}
