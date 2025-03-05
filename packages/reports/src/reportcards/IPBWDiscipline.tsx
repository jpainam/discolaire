import type { Style } from "@react-pdf/stylesheet";
import { Text, View } from "@react-pdf/renderer";

export function IPBWDiscipline({ style }: { style: Style }) {
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

      <SummaryItem name="Total absences" value={10} />
      <SummaryItem name="Justifiees" value={6} />
      <SummaryItem name="Non justifiees" value={4} />
      <SummaryItem name="Retards" value={"15h"} />
      <SummaryItem name="Consigne" lastRow={true} value={3} />
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
