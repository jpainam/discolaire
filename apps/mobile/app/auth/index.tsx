import React, { useEffect, useState } from "react";
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
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "@roninoss/icons";

import { ActivityIndicator } from "~/components/nativewindui/ActivityIndicator";
import { Button } from "~/components/nativewindui/Button";
import { Text } from "~/components/nativewindui/Text";
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuth } from "~/providers/AuthProvider";
import { api } from "~/utils/api";
import { setToken } from "~/utils/session-store";

export default function SignIn() {
  const { colors } = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const utils = api.useUtils();
  const signInMutation = api.auth.signInWithPassword.useMutation({
    onSuccess: async (sessionToken) => {
      setToken(sessionToken);
      await utils.invalidate();
      router.replace("/");
    },
    onError: (error) => {
      console.error(error);
      Alert.alert("Error", error.message);
    },
  });

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);

  const onSignIn = () => {
    console.log("Signing in...");
    console.log("Email: ", email);
    console.log("Password", password);
    signInMutation.mutate({
      username: "admin",
      password: "admin1234",
    });
    // if (!email || !password) {
    //   Alert.alert("Error", "Please fill in all fields");
    // } else {
    //   signInMutation.mutate({ email, password });
    // }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          className="p-4"
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
                onChangeText={setEmail}
              />

              <Text className="mb-2 font-medium">Password</Text>
              <View className="mb-4 flex-row items-center rounded-xl border border-gray-300">
                <TextInput
                  className="flex-1 p-4"
                  placeholder="Enter your password"
                  onChangeText={setPassword}
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
                onPress={onSignIn}
                size={Platform.select({ ios: "lg", default: "md" })}
              >
                {signInMutation.isPending && (
                  <Animated.View entering={FadeIn.delay(200)}>
                    <ActivityIndicator size="small" />
                  </Animated.View>
                )}
                <Text>Continue</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
