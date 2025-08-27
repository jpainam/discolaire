// app/login.tsx
import { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { AuthContext } from "~/components/AuthProvider";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    if (!username || !password) {
      setErrorMsg("Username and password are required");
      setLoading(false);
      return;
    }
    // const { data, error } = await authClient.signIn.username({
    //   username,
    //   password,
    // });
    await authContext.logIn(username, password);
    setLoading(false);
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
        onPress={() => handleLogin()}
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
