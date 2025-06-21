// app/login.tsx
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { authClient } from "~/utils/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    if (!username || !password) {
      setErrorMsg("Username and password are required");
      setLoading(false);
      return;
    }
    const { data, error } = await authClient.signIn.username({
      username,
      password,
    });
    console.log("Sign In Result:", data, error);
    if (error) {
      setErrorMsg(error.message ?? "An error occurred");
      return;
    }
    setLoading(false);
    router.replace("/");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Log In</ThemedText>

      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <HelperText type="error" visible={!!errorMsg}>
        {errorMsg}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      >
        Log In
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 32 },
  input: { marginBottom: 16 },
});
