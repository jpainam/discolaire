import { Text, View } from "@react-pdf/renderer";

export function IPBWSummary() {
  return (
    <View style={{ flexDirection: "row", gap: 4, paddingTop: 5 }}>
      <View style={{ flex: 0.6, flexDirection: "row", gap: 4 }}>
        <View
          style={{
            paddingVertical: "2px",
            paddingHorizontal: "2px",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <View
              style={{
                borderRight: 0,
                marginRight: "4px",
                width: "10px",
              }}
            >
              <Text>Travail</Text>
            </View>
            <View style={{ borderLeft: 0, marginRight: "4px" }}></View>
          </View>
          <SummaryItem name="Felicitations" />
          <SummaryItem name="Encouragements" />
          <SummaryItem name="Viewau d'honneur" />
          <SummaryItem name="Avertissement" />
          <SummaryItem name="Blâme" />
        </View>

        <View
          style={{
            paddingVertical: "2px",
            paddingHorizontal: "2px",
          }}
        >
          <View>
            <View
              style={{
                borderRight: 0,
                marginRight: "4px",
              }}
            >
              <Text> Discipline</Text>
            </View>
            <View style={{ borderLeft: 0, marginRight: "4px" }}></View>
          </View>
          <SummaryItem name="Total absences" value={10} />
          <SummaryItem name="Justifiees" value={6} />
          <SummaryItem name="Non justifiees" value={4} />
          <SummaryItem name="Retards" value={"15h"} />
          <SummaryItem name="Consigne" value={3} />
        </View>
        <View
          style={{
            paddingVertical: "2px",
            paddingHorizontal: "2px",
          }}
        >
          <View>
            <View
              style={{
                borderRight: 0,
              }}
            >
              <Text>Performance</Text>
            </View>
            <View style={{ borderLeft: 0, marginRight: "4px" }}></View>
          </View>
          <SummaryItem name="Moy.Max" />
          <SummaryItem name="Moy.Min" />
          <SummaryItem name="Moy.Cl" />
          <SummaryItem name="Taux de reussite" />
          <SummaryItem name="Mention" />
        </View>
      </View>
      <View style={{ flex: 0.4 }}>
        <SummaryResult />
      </View>
    </View>
  );
}

function SummaryItem({
  name,
  value,
}: {
  name: string;

  value?: React.ReactNode;
}) {
  return (
    <View>
      <View style={{ marginRight: "4px" }}>
        <Text>{name}</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          marginRight: "4px",
        }}
      >
        <Text>{value}</Text>
      </View>
    </View>
  );
}

function SummaryResult() {
  return (
    <View
      style={{
        paddingHorizontal: "2px",
        paddingVertical: "2px",
      }}
    >
      <View style={{ backgroundColor: "#D7D7D7" }}>
        <View
          style={{
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          <Text> Resume des resultats</Text>
        </View>
      </View>
      <View>
        <View
          style={{
            textTransform: "uppercase",
            borderRight: 0,
            fontWeight: "bold",
          }}
        >
          <Text> Moyenne</Text>
        </View>
        <View
          style={{
            borderLeft: 0,
          }}
        >
          <Text> 10.62</Text>
        </View>
      </View>
      <View>
        <View
          style={{
            textTransform: "uppercase",
            borderRight: 0,
            fontWeight: "bold",
          }}
        >
          <Text> Rang</Text>
        </View>
        <View
          style={{
            borderLeft: 0,
          }}
        >
          <Text> 56 / 77</Text>
        </View>
      </View>
      <View>
        <View
          style={{
            textTransform: "uppercase",
            borderRight: 0,
            fontWeight: "bold",
          }}
        >
          <Text> Appreciation</Text>
        </View>
        <View
          style={{
            borderLeft: 0,
            fontWeight: "bold",
          }}
        >
          <Text> Moyen</Text>
        </View>
      </View>
      <View>
        <View
          style={{
            justifyContent: "center",
            backgroundColor: "#D7D7D7",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          <Text> Observation</Text>
        </View>
      </View>
      <View>
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
