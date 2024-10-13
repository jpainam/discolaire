import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "~/components/nativewindui/Button";
import { Text } from "~/components/nativewindui/Text";
import { useColorScheme } from "~/lib/useColorScheme";

export function StudentDetails() {
  const student = {
    name: "Joshua Andrews",
    classroom: "Beautiful Butterflies - Family 139",
    avatarUrl: "https://example.com/avatar.jpg",
    status: "Signed out",
  };
  const { colors } = useColorScheme();
  return (
    <>
      <View className="mb-4 flex-row items-center bg-red-500">
        <Image
          source={{
            uri: "https://discolaire-public.s3.eu-central-1.amazonaws.com/avatars/avatar-01.webp",
          }}
          className="h-32 w-32 rounded-full"
        />
        <View>
          <Text className="text-lg font-semibold">{student.name}</Text>
          <Text className="text-gray-500">{student.classroom}</Text>
          <Text className="text-red-500">{student.status}</Text>
        </View>
      </View>
      <View className="mb-4 flex-row justify-between">
        <Button>
          <Text>Add post</Text>
        </Button>
        <Button>
          <Text>Sign in</Text>
        </Button>
        <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={colors.foreground}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
