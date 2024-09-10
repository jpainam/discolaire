import { StyleSheet } from "react-native";

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

const white = "#fff";
const black = "#000";

export default {
  light: {
    text: "#000",
    onPrimary: white,
    lightPrimary: "#f1f4ff",
    tint: tintColorLight,
    borderColor: "#ccc",
    tabIconDefault: "#ccc",
    placeholderColor: "#ccc",
    tabIconSelected: tintColorLight,

    primary: "#1063FD",
    muted: "#3A5A92",
    background: "#EFEEF6",
    gray: "#6E6E73",
    lightGray: "#DCDCE2",
    green: "#4FEE57",
    lightGreen: "#DBFFCB",
    red: "#EF0827",
    yellow: "#FCC70B",
  },
  dark: {
    text: "#fff",
    lightPrimary: "#f1f4ff",
    gray: "#ccc",
    background: "#000",
    tint: tintColorDark,
    primary: white,
    borderColor: "#555",
    onPrimary: black,
    placeholderColor: "#555",
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    muted: "#3A5A92",
    lightGray: "#DCDCE2",
    green: "#4FEE57",
    lightGreen: "#DBFFCB",
    red: "#EF0827",
    yellow: "#FCC70B",
  },
};

export const defaultStyles = StyleSheet.create({
  block: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 14,
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#DCDCE2",
    marginLeft: 50,
  },
});
