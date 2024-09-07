import { Platform, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import EditScreenInfo from "~/components/EditScreenInfo";
import { Text, useThemeColor, View } from "~/components/Themed";

export default function ModalScreen() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Search",
          headerBlurEffect: "regular",
          headerTransparent: true,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerSearchBarOptions: {
            placeholder: "Search students",
            onChangeText: (text) => {
              // search for the typed student;
              console.log(text.nativeEvent.text);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSearchButtonPress: (ev: any) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              console.log(ev?.nativeEvent?.text);
            },
            hideWhenScrolling: false,
          },
        }}
      />
      <Text style={styles.title}>Modal</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
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
