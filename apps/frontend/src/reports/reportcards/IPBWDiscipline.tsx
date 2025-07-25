import type { Style } from "@react-pdf/stylesheet";
import { Text, View } from "@react-pdf/renderer";

export function IPBWDiscipline({
  discipline,
  style,
}: {
  style: Style;
  discipline: {
    absence: number;
    lateness: number;
    justifiedLateness: number;
    consigne: number;
    justifiedAbsence: number;
  };
}) {
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
        <Text style={{ paddingLeft: 4 }}>Discipline</Text>
      </View>

      <SummaryItem name="Total absences" value={discipline.absence} />
      <SummaryItem name="Justifiees" value={discipline.justifiedAbsence} />
      <SummaryItem
        name="Non justifiees"
        value={discipline.absence - discipline.justifiedAbsence}
      />
      <SummaryItem name="Retards" value={discipline.lateness} />
      <SummaryItem name="Consigne" lastRow={true} value={discipline.consigne} />
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
