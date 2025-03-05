import { Text, View } from "@react-pdf/renderer";
import { sum } from "lodash";

export function IPBWGroup({
  W,
  cards,
  lastRow,
  groupName,
}: {
  W: string[];
  groupName: string;
  lastRow: boolean;
  cards: {
    courseName: string;
    isAbsent: boolean;
    avg: number;
    coefficient: number;
    rank: number;
    classroom: {
      min: number;
      max: number;
      avg: number;
    };
    teacher: {
      prefix: string;
      lastName: string;
      firstName: string;
    };
  }[];
}) {
  return (
    <>
      {cards.map((card, index) => {
        return (
          <View
            style={{
              borderBottom: "1px solid black",
              flexDirection: "row",
              display: "flex",
            }}
            key={`card-${index}-${index}`}
          >
            <View
              style={{
                width: W[0],
                flexDirection: "column",
                display: "flex",
                borderRight: "1px solid black",
                paddingHorizontal: 2,
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  overflow: "hidden",
                  maxLines: 1,
                }}
              >
                {card.courseName}
              </Text>
              <Text style={{ paddingLeft: "8px" }}>
                {card.teacher.prefix} {card.teacher.lastName}
              </Text>
            </View>

            <View
              style={{
                width: W[1],
                borderRight: "1px solid black",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text> {!card.isAbsent && card.avg}</Text>
            </View>
            <View
              style={{
                width: W[2],
                borderRight: "1px solid black",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text> {!card.isAbsent && card.coefficient}</Text>
            </View>
            <View
              style={{
                width: W[3],
                borderRight: "1px solid black",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>
                {!card.isAbsent && (card.avg * card.coefficient).toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                width: W[4],
                borderRight: "1px solid black",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{!card.isAbsent && card.rank}</Text>
            </View>
            <View
              style={{
                width: W[5],
                alignItems: "center",
                justifyContent: "center",
                borderRight: "1px solid black",
              }}
            >
              <Text>{card.classroom.avg.toFixed(2)}</Text>
            </View>
            <View
              style={{
                width: W[6],
                alignItems: "center",
                justifyContent: "center",
                borderRight: "1px solid black",
              }}
            >
              <Text>
                {card.classroom.min.toFixed(2)}/{card.classroom.max.toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                width: W[7],
                textTransform: "uppercase",
                paddingLeft: 4,
                justifyContent: "center",
              }}
            >
              <Text> Moyen</Text>
            </View>
          </View>
        );
      })}

      <View
        style={{
          backgroundColor: "#D7D7D7",
          fontSize: 8,
          flexDirection: "row",
          display: "flex",
          fontWeight: "bold",
          width: "100%",
          borderBottom: lastRow ? "" : "1px solid black",
        }}
      >
        <View
          style={{
            width: "46%",
            paddingVertical: 2,
            borderRight: "1px solid black",

            justifyContent: "center",
          }}
        >
          <Text style={{ paddingLeft: 4 }}>{groupName}</Text>
        </View>
        <View
          style={{
            width: "6%",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>{sum(cards.map((c) => c.coefficient))}</Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            width: "6%",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>
            {sum(cards.map((c) => (c.avg || 0) * c.coefficient)).toFixed(1)}
            {/* {sum(cards.map((c) => 20 * c.coefficient)).toFixed(1)} */}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            width: "22%",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>
            MOY :
            {(
              sum(cards.map((c) => c.avg * c.coefficient)) /
              sum(cards.map((c) => c.coefficient))
            ).toFixed(2)}
          </Text>
        </View>
      </View>
    </>
  );
}
