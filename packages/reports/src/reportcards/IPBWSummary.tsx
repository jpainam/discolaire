import { Text, View } from "@react-pdf/renderer";
import { CheckIcon } from "lucide-react";

export function IPBWSummary({ average }: { average: number }) {
  return (
    <View style={{ flexDirection: "row", marginTop: "4px", gap: 2 }}>
      <View
        style={{
          width: "20%",
          flexDirection: "column",
          border: "1px solid black",
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
          <Text style={{ paddingLeft: 4 }}>Travail</Text>
        </View>

        <SummaryItem name="Felicitations" value={<CheckIcon />} />
        <SummaryItem name="Encouragements" value={10} />
        <SummaryItem name="Viewau d'honneur" value={10} />
        <SummaryItem name="Avertissement" />
        <SummaryItem name="Blâme" value={10} lastRow={true} />
      </View>

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
          <Text style={{ paddingLeft: 4 }}>Discipline</Text>
        </View>

        <SummaryItem name="Total absences" value={10} />
        <SummaryItem name="Justifiees" value={6} />
        <SummaryItem name="Non justifiees" value={4} />
        <SummaryItem name="Retards" value={"15h"} />
        <SummaryItem name="Consigne" lastRow={true} value={3} />
      </View>
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
          <Text style={{ paddingLeft: 4 }}>Discipline</Text>
        </View>
        <SummaryItem name="Moy.Max" value={10} />
        <SummaryItem name="Moy.Min" value={10} />
        <SummaryItem name="Moy.Cl" value={10} />
        <SummaryItem name="Taux de reussite" value={10} />
        <SummaryItem name="Mention" lastRow={true} value={10} />
      </View>
      <SummaryResult average={average} />
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

function SummaryResult({ average }: { average: number }) {
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
            paddingLeft: 4,
            fontWeight: "bold",
          }}
        >
          Resume des resultats
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
          <Text> Moyenne</Text>
        </View>
        <View
          style={{
            fontWeight: "bold",
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text> {average}</Text>
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
          <Text> Rang</Text>
        </View>
        <View
          style={{
            fontWeight: "bold",
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text> 56 / 77</Text>
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
          <Text> Appreciation</Text>
        </View>
        <View
          style={{
            fontWeight: "bold",
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text> Moyen</Text>
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
          <Text> Observation</Text>
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
