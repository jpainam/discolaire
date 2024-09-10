const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

const white = "#fff";
const black = "#000";
const blue = "#1F41BB";

export default {
  light: {
    text: "#000",
    gray: "#ccc",
    primary: blue,
    onPrimary: white,
    lightPrimary: "#f1f4ff",
    background: "#f8f8f8",
    tint: tintColorLight,
    borderColor: "#ccc",
    tabIconDefault: "#ccc",
    placeholderColor: "#ccc",
    tabIconSelected: tintColorLight,
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
  },
};
