import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "@roninoss/icons";

import { Button } from "~/components/nativewindui/Button";
import { Text } from "~/components/nativewindui/Text";
import { useColorScheme } from "~/lib/useColorScheme";

export default function SignIn() {
  const { colors } = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mx-auto w-full max-w-sm flex-1 justify-between gap-4 px-4 py-4">
            <View className="ios:pt-8 pt-12">
              <Text className="text-center text-2xl font-bold">Sign In</Text>
            </View>

            <View className="my-8 items-center">
              <Image
                source={{ uri: "https://via.placeholder.com/150" }}
                className="h-32 w-32 rounded-full"
              />
            </View>

            <View className="w-full">
              <Text className="mb-2 font-medium">Username</Text>
              <TextInput
                className="mb-4 rounded-xl border border-gray-300 p-4"
                placeholder="Enter your username"
              />

              <Text className="mb-2 font-medium">Password</Text>
              <View className="mb-4 flex-row items-center rounded-xl border border-gray-300">
                <TextInput
                  className="flex-1 p-4"
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="px-3"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="gap-4">
              <View className="items-center">
                <Icon
                  name="account-multiple"
                  size={24}
                  color={colors.primary}
                  ios={{ renderingMode: "hierarchical" }}
                />
                <Text variant="caption2" className="pt-1 text-center">
                  By pressing continue, you agree to our{" "}
                  <Link href="/">
                    <Text variant="caption2" className="text-primary">
                      Terms of Service
                    </Text>
                  </Link>{" "}
                  and that you have read our{" "}
                  <Link href="/">
                    <Text variant="caption2" className="text-primary">
                      Privacy Policy
                    </Text>
                  </Link>
                </Text>
              </View>
              <Button
                onPress={() => {
                  Alert.alert("Continue");
                }}
                size={Platform.select({ ios: "lg", default: "md" })}
              >
                <Text>Continue</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
