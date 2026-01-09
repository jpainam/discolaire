import { Text, View } from "@react-pdf/renderer";



import { getTranslation } from "./translation";


export function IPBWSignature({
  cycle,
  lang,
}: {
  cycle?: string;
  lang: "fr" | "en";
}) {
  const t = getTranslation(lang);
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 2,
        display: "flex",
        fontWeight: "bold",
        fontSize: 8,
        width: "80%",
      }}
    >
      <View
        style={{
          width: "30%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}> {t("Parents")}</Text>
      </View>
      <View
        style={{
          width: "30%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}>{t("Prof. Principal")}</Text>
      </View>

      <View
        style={{
          width: "40%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}>
          {" "}
          {t(`Directeur des Etudes ${cycle}`)}
        </Text>
      </View>
    </View>
  );
}

export function IPBWSignatureTrimestre({ lang }: { lang: "fr" | "en" }) {
  const t = getTranslation(lang);
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 2,
        display: "flex",
        fontWeight: "bold",
        fontSize: 8,
        width: "80%",
      }}
    >
      <View
        style={{
          width: "30%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}> {t("Parents")}</Text>
      </View>
      <View
        style={{
          width: "30%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}>{t("Prof. Principal")}</Text>
      </View>

      <View
        style={{
          width: "40%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}>
          {t("Le Chef d'établissement")}
        </Text>
      </View>
    </View>
  );
}

export function IPBWSignatureAnnual({lang}: { lang: "fr" | "en" }) {
  const t = getTranslation(lang);
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 2,
        display: "flex",
        fontWeight: "bold",
        fontSize: 8,
        width: "80%",
      }}
    >
      <View
        style={{
          width: "30%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}> {t("Parents")}</Text>
      </View>
      <View
        style={{
          width: "30%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}>{t("Prof. Principal")}</Text>
      </View>

      <View
        style={{
          width: "40%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}>
          {t("Le Chef d'établissement")}
        </Text>
      </View>
    </View>
  );
}