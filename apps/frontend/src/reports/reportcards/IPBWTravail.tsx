import type { Style } from "@react-pdf/stylesheet";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Text, View } from "@react-pdf/renderer";

import { FontAwesomeIcon } from "../components/FontAwesomeIcon";
import { getTranslation } from "./translation";

export function IPBWTravail({
  grade,
  style,
  lang,
}: {
  grade: number;
  style: Style;
  lang: "fr" | "en";
}) {
  const t = getTranslation(lang);
  return (
    <View
      style={{
        width: "20%",
        flexDirection: "column",
        border: "1px solid black",
        display: "flex",
        ...style,
      }}
    >
      <View
        style={{
          borderBottom: "1px solid black",
          paddingHorizontal: "2px",
          fontWeight: "bold",
          paddingVertical: 1,
        }}
      >
        <Text style={{ paddingLeft: 4 }}>{t("Travail")}</Text>
      </View>

      <SummaryItem name={t("Félicitations")} value={grade >= 18} />
      <SummaryItem name={t("Encouragements")} value={grade >= 14} />
      <SummaryItem name={t("Tableau d'honneur")} value={grade >= 12} />
      <SummaryItem name={t("Avertissement")} value={grade <= 9.99} />
      <SummaryItem name={t("Blâme")} value={grade <= 5} lastRow={true} />
    </View>
  );
}

function SummaryItem({
  name,
  value = false,
  lastRow = false,
}: {
  name: string;
  lastRow?: boolean;
  value?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", display: "flex" }}>
      <View
        style={{
          width: "75%",
          paddingVertical: 2,
          borderBottom: lastRow ? "" : "1px solid black",
          borderRight: "1px solid black",
        }}
      >
        <Text style={{ paddingLeft: 4 }}>{name}</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "25%",
          borderBottom: lastRow ? "" : "1px solid black",
        }}
      >
        {value && (
          <FontAwesomeIcon
            faIcon={faCheck}
            style={{ color: "#000", width: "8px" }}
          />
        )}
      </View>
    </View>
  );
}
