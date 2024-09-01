import { Button, StyleSheet } from "react-native";
import { Link } from "expo-router";

import EditScreenInfo from "~/components/EditScreenInfo";
import { Text, View } from "~/components/Themed";
import { useSignOut } from "~/utils/auth";

export default function TabOneScreen() {
  //const user = useUser();
  //const signIn = useSignIn();

  const signOut = useSignOut();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button
        title="Try login"
        onPress={() => {
          //onSubmit();
        }}
      />
      <Button
        title="Sign out"
        onPress={() => {
          void signOut();
        }}
      />
      <Link href={"/classes"}>
        <Text>Liste of des classes</Text>
      </Link>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
