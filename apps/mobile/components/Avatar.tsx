/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { ViewProps } from "react-native";
import { Image, StyleSheet, View } from "react-native";
export type AvatarProps = ViewProps & {
  imageUrl?: string | null;
};

export function Avatar({ imageUrl, style, ...props }: AvatarProps) {
  if (imageUrl) {
    return (
      <View style={style} {...props}>
        <Image
          style={styles.photo}
          source={{
            uri: imageUrl,
          }}
        />
      </View>
    );
  } else {
    return (
      <View style={style} {...props}>
        <Image
          style={styles.photo}
          source={require("~/assets/images/avatar-01.webp")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    height: 40,
    width: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
