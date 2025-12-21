import { Text, View } from "@react-pdf/renderer";

import { getTranslation } from "./translation";

export function IPBWTableHeader({
  W,
  lang,
}: {
  W: number[] | string[];
  lang: "fr" | "en";
}) {
  const t = getTranslation(lang);
  return (
    <View
      style={{
        backgroundColor: "#000",
        color: "#fff",
        flexDirection: "row",
        display: "flex",
        paddingVertical: 2,
        borderBottom: "1px solid black",
        fontWeight: "bold",
        fontSize: 8,
      }}
    >
      <View
        style={{
          padding: 2,
          width: W[0],
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>{t("Matières")}</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          width: W[1],
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>{t("Note")}</Text>
      </View>
      <View
        style={{
          width: W[2],
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Coef.</Text>
      </View>
      <View
        style={{
          width: W[3],
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Total</Text>
      </View>
      <View
        style={{
          width: W[4],
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> {t("Rang")}</Text>
      </View>
      <View
        style={{
          width: W[5],
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> {t("Moy C")}</Text>
      </View>
      <View
        style={{
          width: W[6],
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> {t("Min/Max")}</Text>
      </View>
      <View
        style={{
          //width: W[7],
          justifyContent: "center",

          paddingHorizontal: 2,
        }}
      >
        <Text> {t("Appréciation")}</Text>
      </View>
    </View>
  );
}
