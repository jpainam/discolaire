/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Image, StyleSheet } from "react-native";
export function Avatar({ imageUrl }: { imageUrl?: string }) {
  if (imageUrl) {
    return (
      <Image
        style={styles.photo}
        source={{
          uri: imageUrl,
        }}
      />
    );
  } else {
    return (
      <Image
        style={styles.photo}
        source={require("~/assets/images/avatar-01.webp")}
      />
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
