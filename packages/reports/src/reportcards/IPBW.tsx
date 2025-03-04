import { Document, Page, Text, View } from "@react-pdf/renderer";
import { sortBy, sum } from "lodash";

import "../fonts";

import type { RouterOutputs } from "@repo/api";

import { IPBWHeader } from "../headers/IPBWHeader";
import { IPBWStudentInfo } from "./IPBWStudentInfo";
import { IPBWSummary } from "./IPBWSummary";
import { IPBWTableHeader } from "./IPBWTableHeader";

const W = [0.4, 0.06, 0.06, 0.06, 0.06, 0.06, 0.1, 0.2];
type ReportCardType =
  RouterOutputs["reportCard"]["getStudent"]["result"][number];
export function IPBW({
  school,
  student,
  groups,
  contact,
  schoolYear,
}: {
  groups: Record<number, ReportCardType[]>;
  student: RouterOutputs["student"]["get"];
  schoolYear: RouterOutputs["schoolYear"]["get"];
  contact: RouterOutputs["student"]["getPrimaryContact"];
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
}) {
  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 40,
          fontSize: 7,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Roboto",
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <IPBWHeader school={school} />
          <View
            style={{
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                alignSelf: "center",
                fontSize: 10,
              }}
            >
              BULLETIN SCOLAIRE DU PREMIER TRIMESTRE
            </Text>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 9,
              }}
            >
              Année scolaire {schoolYear.name}
            </Text>
          </View>
          <IPBWStudentInfo student={student} contact={contact} />
          <View
            style={{
              paddingVertical: "0px",
              paddingHorizontal: "2px",
            }}
          >
            <IPBWTableHeader W={W} />
            {Object.keys(groups).map((groupId: string) => {
              let cards = groups[Number(groupId)];
              if (!cards || cards.length == 0) return null;
              cards = sortBy(cards, "order").filter((c) => !c.isAbsent);
              const card = cards[0];
              if (!card) return null;
              const group = card.subjectGroup;
              if (!group) return null;

              return (
                <ReportCardGroup
                  groupId={Number(groupId)}
                  key={`card-${groupId}`}
                  cards={cards}
                  group={{ name: group.name }}
                />
              );
            })}
          </View>
          <IPBWSummary />
          <View style={{ flexDirection: "row", gap: 4, paddingTop: 5 }}>
            <View style={{ flex: 0.6, flexDirection: "row", gap: 4 }}>
              <View style={{ paddingTop: "4px" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    borderBottom: "1px solid black",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#D7D7D7",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      justifyContent: "center",
                      paddingHorizontal: "4px",
                    }}
                  >
                    <Text> Parents</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#D7D7D7",
                      justifyContent: "center",
                      paddingHorizontal: "4px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    <Text>Prof. Principal</Text>
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
                      paddingVertical: 30,
                    }}
                  ></View>
                  <View></View>
                </View>
              </View>
            </View>
            <View style={{ flex: 0.4 }}>
              <View style={{ paddingTop: "4px" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#D7D7D7",
                      justifyContent: "center",
                      paddingHorizontal: "4px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    <Text> Directeur</Text>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      paddingVertical: 30,
                      justifyContent: "center",
                      paddingHorizontal: "4px",
                    }}
                  ></View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function ReportCardGroup({
  cards,
  groupId,
  group,
}: {
  groupId: number;
  group: { name: string };
  cards: ReportCardType[];
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
            key={`card-${groupId}-${index}`}
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
                style={{ fontWeight: "bold", overflow: "hidden", maxLines: 1 }}
              >
                {card.course.name}
              </Text>
              <Text style={{ paddingLeft: "8px" }}>
                {card.teacher?.prefix} {card.teacher?.lastName}
              </Text>
            </View>

            <View
              style={{
                width: W[1],
                borderRight: "1px solid black",
              }}
            >
              <Text> {!card.isAbsent && card.avg}</Text>
            </View>
            <View
              style={{
                width: W[2],
                borderRight: "1px solid black",
              }}
            >
              <Text> {!card.isAbsent && card.coefficient}</Text>
            </View>
            <View
              style={{
                width: W[3],
                borderRight: "1px solid black",
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
              }}
            >
              <Text>{!card.isAbsent && card.rank}</Text>
            </View>
            <View
              style={{
                width: W[5],
                borderRight: "1px solid black",
              }}
            >
              <Text>{card.classroom.avg.toFixed(2)}</Text>
            </View>
            <View
              style={{
                width: W[6],
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
          borderBottom: "1px solid black",
        }}
      >
        <View
          style={{
            paddingHorizontal: "4px",
            paddingVertical: "1px",
            alignItems: "flex-start",
            borderRight: 0,
            width: 4,
          }}
        >
          <Text>{group.name}</Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            borderLeft: 0,
            borderRight: 0,
            width: 6,
          }}
        >
          <Text>{sum(cards.map((c) => c.coefficient))}</Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            borderLeft: 0,
            borderRight: 0,
            width: 3,
          }}
        >
          <Text>
            Point:{" "}
            {sum(cards.map((c) => (c.avg || 0) * c.coefficient)).toFixed(1)}/
            {sum(cards.map((c) => 20 * c.coefficient)).toFixed(1)}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            borderLeft: 0,
          }}
        >
          <Text>
            Moyenne :
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
