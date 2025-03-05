import type { Style } from "@react-pdf/stylesheet";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Text, View } from "@react-pdf/renderer";

import { FontAwesomeIcon } from "../components/FontAwesomeIcon";

export function IPBWTravail({ style }: { style: Style }) {
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
        <Text style={{ paddingLeft: 4 }}>Travail</Text>
      </View>

      <SummaryItem name="Felicitations" value={true} />
      <SummaryItem name="Encouragements" value={false} />
      <SummaryItem name="Tableau d'honneur" value={true} />
      <SummaryItem name="Avertissement" value={false} />
      <SummaryItem name="Blâme" value={false} lastRow={true} />
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
