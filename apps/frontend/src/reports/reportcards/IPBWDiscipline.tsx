import type { Style } from "@react-pdf/stylesheet";
import { Text, View } from "@react-pdf/renderer";

import { getTranslation } from "./translation";

export function IPBWDiscipline({
  discipline,
  style,
  lang,
}: {
  style: Style;
  lang: "fr" | "en";
  discipline: {
    absence: number;
    late: number;
    justifiedLate: number;
    consigne: number;
    justifiedAbsence: number;
  };
}) {
  const t = getTranslation(lang);
  return (
    <View
      style={{
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
        <Text style={{ paddingLeft: 4 }}>{t("Discipline")}</Text>
      </View>

      <SummaryItem name={t("Total absences")} value={discipline.absence} />
      <SummaryItem name={t("Justifiées")} value={discipline.justifiedAbsence} />
      <SummaryItem
        name={t("Non justifiées")}
        value={Math.max(discipline.absence - discipline.justifiedAbsence, 0)}
      />
      <SummaryItem name={t("Retards")} value={discipline.late} />
      <SummaryItem
        name={t("Consignes")}
        lastRow={true}
        value={discipline.consigne}
      />
    </View>
  );
}

function SummaryItem({
  name,
  value,
  lastRow = false,
}: {
  name: string;
  lastRow?: boolean;
  value?: React.ReactNode;
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
        <Text>{value != 0 ? value : ""}</Text>
      </View>
    </View>
  );
}
