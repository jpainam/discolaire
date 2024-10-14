import { View } from "react-native";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/nativewindui/Avatar";
import { Text } from "~/components/nativewindui/Text";
import { cn } from "~/lib/cn";
import { useColorScheme } from "~/lib/useColorScheme";

export function Detail() {
  const { colorScheme } = useColorScheme();
  return (
    <View
      pointerEvents="none"
      className={cn(
        "flex flex-row items-center gap-4 px-4 py-2",
        colorScheme === "dark" ? "bg-transparent" : "bg-white",
      )}
    >
      <Avatar className="h-[80px] w-[80px]" alt="AV">
        <AvatarImage
          source={{
            uri: "https://discolaire-public.s3.eu-central-1.amazonaws.com/avatars/avatar-01.webp",
          }}
        />
        <AvatarFallback>
          <Text>AV</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex flex-col gap-0">
        <Text className="text-xl font-bold">Jean Paul Ainam Bacon</Text>
        <View className="flex flex-row items-center gap-2">
          <View className="rounded-lg border-green-500 bg-green-100 px-2 dark:bg-green-900/20">
            <Text className="text-sm text-green-600">5eme</Text>
          </View>
          <View className="rounded-lg border-red-500 bg-red-100 px-2 dark:bg-red-900/20">
            <Text className="text-sm text-red-600">Redoublant</Text>
          </View>
        </View>
        <Text className="text-sm text-muted-foreground">27 Juin 2000</Text>
      </View>
    </View>
  );
}
