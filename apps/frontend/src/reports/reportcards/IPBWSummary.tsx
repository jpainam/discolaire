import { Text, View } from "@react-pdf/renderer";

import { getAppreciations } from "~/utils/appreciations";
import { IPBWDiscipline } from "./IPBWDiscipline";
import { IPBWTravail } from "./IPBWTravail";
import { getTranslation } from "./translation";

export function IPBWSummary({
  average,
  summary,
  effectif,
  successRate,
  discipline,
  lang,
  rank,
}: {
  average: number;
  rank: string;
  effectif: number;
  successRate: number;
  lang: "fr" | "en";
  discipline: {
    absence: number;
    late: number;
    justifiedLate: number;
    consigne: number;
    justifiedAbsence: number;
  };
  summary: {
    min: number;
    max: number;
    average: number;
  };
}) {
  const t = getTranslation(lang);
  return (
    <View style={{ flexDirection: "row", marginTop: "4px", gap: 2 }}>
      <IPBWTravail lang={lang} grade={average} style={{ width: "20%" }} />
      <IPBWDiscipline
        lang={lang}
        discipline={discipline}
        style={{ width: "20%" }}
      />
      <View
        style={{
          width: "20%",
          border: "1px solid black",
          flexDirection: "column",
          display: "flex",
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
          <Text style={{ paddingLeft: 2 }}>Performance</Text>
        </View>
        <SummaryItem name={t("Moy Max")} value={summary.max.toFixed(2)} />
        <SummaryItem name={t("Moy Min")} value={summary.min.toFixed(2)} />
        <SummaryItem name={t("Moy C")} value={summary.average.toFixed(2)} />
        <SummaryItem
          name={t("Taux de reussite")}
          value={(successRate * 100).toFixed(2) + "%"}
        />
        <View
          style={{
            justifyContent: "center",
            paddingVertical: 2,
            alignItems: "center",
          }}
        >
          <Text>{getAppreciations(summary.average)}</Text>
        </View>
        {/* <SummaryItem
          name="Mention"
          lastRow={true}
          value={getAppreciations(summary.avg)}
        /> */}
      </View>
      <SummaryResult
        effectif={effectif}
        rank={rank}
        average={average}
        lang={lang}
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
        <Text>{value}</Text>
      </View>
    </View>
  );
}

function SummaryResult({
  average,
  effectif,
  rank,
  lang,
}: {
  average: number;
  rank: string;
  effectif: number;
  lang: "fr" | "en";
}) {
  const t = getTranslation(lang);
  return (
    <View
      style={{
        width: "40%",
        border: "1px solid black",
        flexDirection: "column",
        display: "flex",
      }}
    >
      <View
        style={{
          backgroundColor: "#D7D7D7",
          paddingVertical: 2,
          borderBottom: "1px solid black",
        }}
      >
        <Text
          style={{
            textTransform: "uppercase",
            paddingLeft: 2,
            fontWeight: "bold",
          }}
        >
          {t("Résume des resultats")}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          borderBottom: "1px solid black",
        }}
      >
        <View
          style={{
            textTransform: "uppercase",
            width: "50%",
            paddingVertical: 2,
            borderRight: "1px solid black",
            fontWeight: "bold",
          }}
        >
          <Text> {t("Moyenne")}</Text>
        </View>
        <View
          style={{
            fontWeight: "bold",
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text> {average.toFixed(2)}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          borderBottom: "1px solid black",
        }}
      >
        <View
          style={{
            textTransform: "uppercase",
            borderRight: "1px solid black",
            width: "50%",
            paddingVertical: 2,
            fontWeight: "bold",
          }}
        >
          <Text> {t("Rang")}</Text>
        </View>
        <View
          style={{
            fontWeight: "bold",
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>
            {rank} / {effectif}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          borderBottom: "1px solid black",
        }}
      >
        <View
          style={{
            textTransform: "uppercase",
            borderRight: "1px solid black",
            width: "50%",
            fontWeight: "bold",
            paddingVertical: 2,
          }}
        >
          <Text> {t("Appréciation")}</Text>
        </View>
        <View
          style={{
            fontWeight: "bold",
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ textTransform: "uppercase" }}>
            {getAppreciations(average)}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          display: "flex",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          <Text> {t("Observation")}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          display: "flex",
        }}
      >
        <View
          style={{
            borderRight: 0,
          }}
        ></View>
        <View
          style={{
            borderLeft: 0,
            color: "#fff",
          }}
        >
          <Text> O</Text>
        </View>
      </View>
    </View>
  );
}
