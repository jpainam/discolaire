import { Card } from "heroui-native";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { useAuth } from "@/contexts/auth-context";
import { authClient } from "@/utils/auth-client";
import { clearSchoolYearContext } from "@/utils/school-year";
import { queryClient } from "@/utils/trpc";

export default function Home() {
  const { session } = useAuth();

  return (
    <Container className="p-6">
      <View className="py-4 mb-6">
        <Text className="text-4xl font-bold text-foreground mb-2">
          Discolaire
        </Text>
        <Text className="text-muted">Native dashboard</Text>
      </View>

      <Card variant="secondary" className="mb-6 p-4">
        <Text className="text-foreground text-base mb-2">
          Welcome, <Text className="font-medium">{session?.user.name}</Text>
        </Text>
        <Text className="text-muted text-sm mb-4">{session?.user.email}</Text>
        <Pressable
          className="bg-danger py-3 px-4 rounded-lg self-start active:opacity-70"
          onPress={async () => {
            await authClient.signOut();
            await clearSchoolYearContext();
            await queryClient.invalidateQueries();
          }}
        >
          <Text className="text-foreground font-medium">Sign Out</Text>
        </Pressable>
      </Card>

      <Card variant="secondary" className="p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Card.Title>System Status</Card.Title>
        </View>

        <Card className="p-4">
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-foreground font-medium mb-1">
                TRPC Backend
              </Text>
              <Card.Description>Connected</Card.Description>
            </View>
          </View>
        </Card>
      </Card>
    </Container>
  );
}
