import { ActivityIndicator, Button, StyleSheet } from "react-native";
import { Link } from "expo-router";

import EditScreenInfo from "~/components/EditScreenInfo";
import { Text, View } from "~/components/Themed";
import { useAuth } from "~/providers/auth-provider";
import { api } from "~/utils/api";
import { useSignOut } from "~/utils/auth";

export default function TabOneScreen() {
  //const user = useUser();
  //const signIn = useSignIn();
  const schoolYearsQuery = api.schoolYear.all.useQuery();
  const signOut = useSignOut();
  const { user, session } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Text>{JSON.stringify(user)}</Text>
      <Text>{JSON.stringify(session)}</Text>
      {schoolYearsQuery.isPending && <ActivityIndicator />}
      <Text>{JSON.stringify(schoolYearsQuery.data)}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button
        title="Try login"
        onPress={() => {
          console.log("login");
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
