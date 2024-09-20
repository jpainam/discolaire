import { useEffect, useState } from "react";
import { Alert, SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { Text, useThemeColor, View } from "~/components/Themed";
import FontSize from "~/constants/FontSize";
import Spacing from "~/constants/Spacing";
import { useAuth } from "~/providers/auth-provider";
import { api } from "~/utils/api";
import { setToken } from "~/utils/session-store";

export default function Page() {
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "primary");
  const borderColor = useThemeColor({}, "borderColor");
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
    >
      <View
        style={{
          padding: Spacing * 2,
        }}
      >
        <View
          style={{
            padding: Spacing * 2,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: primaryColor,
              fontFamily: "PoppinsBold",
              marginVertical: Spacing * 3,
            }}
          >
            Connectez-vous ici
          </Text>
          <Text
            style={{
              fontFamily: "PoppinsSemibold",
              fontSize: FontSize.large,
              maxWidth: "60%",
              textAlign: "center",
            }}
          >
            Welcome back you've been missed!
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 3,
          }}
        >
          <TextInput
            style={{
              fontFamily: "PoppinsRegular",
              fontSize: FontSize.small,
              borderColor: borderColor,
              borderWidth: 1,
              padding: Spacing,
              //backgroundColor: Colors.light.lightPrimary,
              borderRadius: Spacing,

              marginVertical: Spacing,
            }}
            autoCapitalize="none"
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={{
              fontFamily: "PoppinsRegular",
              fontSize: FontSize.small,
              borderColor: borderColor,
              borderWidth: 1,
              padding: Spacing,
              //backgroundColor: Colors.light.lightPrimary,
              borderRadius: Spacing,
              marginVertical: Spacing,
            }}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: "PoppinsSemibold",
              fontSize: FontSize.small,
              //color: Colors.light.primary,
              alignSelf: "flex-end",
            }}
          >
            Mot de passe oublié ?
          </Text>
        </View>
        <TouchableOpacity
          style={{
            padding: Spacing * 2,
            //backgroundColor: Colors.light.primary,
            marginVertical: Spacing * 3,
            borderRadius: Spacing,
            ///shadowColor: Colors.light.primary,
            shadowOffset: {
              width: 0,
              height: Spacing,
            },
            shadowOpacity: 0.3,
            shadowRadius: Spacing,
          }}
          onPress={onSignIn}
        >
          <Text
            style={{
              fontFamily: "PoppinsBold",
              //color: Colors.light.onPrimary,
              textAlign: "center",
              fontSize: FontSize.large,
            }}
          >
            Connexion
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
