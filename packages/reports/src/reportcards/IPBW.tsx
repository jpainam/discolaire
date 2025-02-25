import { Document, Page, Text, View } from "@react-pdf/renderer";
import { sortBy, sum } from "lodash";

import "../fonts";

import type { RouterOutputs } from "@repo/api";

import { IPBWHeader } from "../headers/IPBWHeader";
import { Table, TableCell, TableHeader, TableRow } from "../table";
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
          <Table
            //weightings={[0.4, 0.06, 0.06, 0.06, 0.06, 0.06, 0.1, 0.2]}
            style={
              {
                //paddingVertical: "0px",
                //paddingHorizontal: "2px",
              }
            }
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
            <TableRow>
              <TableCell w={W[0]}>
                <Text>w</Text>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </Table>
          <IPBWSummary />
          <View style={{ flexDirection: "row", gap: 4, paddingTop: 5 }}>
            <View style={{ flex: 0.6, flexDirection: "row", gap: 4 }}>
              <Table style={{ paddingTop: "4px" }}>
                <TableHeader>
                  <TableCell
                    style={{
                      backgroundColor: "#D7D7D7",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      justifyContent: "center",
                      paddingHorizontal: "4px",
                    }}
                  >
                    Parents
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "#D7D7D7",
                      justifyContent: "center",
                      paddingHorizontal: "4px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    <Text>Prof. Principal</Text>
                  </TableCell>
                </TableHeader>
                <TableRow>
                  <TableCell
                    style={{
                      paddingVertical: 30,
                    }}
                  ></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </Table>
            </View>
            <View style={{ flex: 0.4 }}>
              <Table style={{ paddingTop: "4px" }}>
                <TableHeader>
                  <TableCell
                    style={{
                      backgroundColor: "#D7D7D7",
                      justifyContent: "center",
                      paddingHorizontal: "4px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Directeur
                  </TableCell>
                </TableHeader>
                <TableRow>
                  <TableCell
                    style={{
                      paddingVertical: 30,
                      justifyContent: "center",
                      paddingHorizontal: "4px",
                    }}
                  ></TableCell>
                </TableRow>
              </Table>
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
          <TableRow
            style={{ borderBottom: "1px solid black" }}
            key={`card-${groupId}-${index}`}
          >
            <TableCell
              w={W[0]}
              style={{
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
            </TableCell>

            <TableCell
              w={W[1]}
              style={{
                borderRight: "1px solid black",
              }}
            >
              <Text> {!card.isAbsent && card.avg}</Text>
            </TableCell>
            <TableCell
              w={W[2]}
              style={{
                borderRight: "1px solid black",
              }}
            >
              <Text> {!card.isAbsent && card.coefficient}</Text>
            </TableCell>
            <TableCell
              w={W[3]}
              style={{
                borderRight: "1px solid black",
              }}
            >
              <Text>
                {!card.isAbsent && (card.avg * card.coefficient).toFixed(2)}
              </Text>
            </TableCell>
            <TableCell
              w={W[4]}
              style={{
                borderRight: "1px solid black",
              }}
            >
              <Text>{!card.isAbsent && card.rank}</Text>
            </TableCell>
            <TableCell
              w={W[5]}
              style={{
                borderRight: "1px solid black",
              }}
            >
              <Text>{card.classroom.avg.toFixed(2)}</Text>
            </TableCell>
            <TableCell
              w={W[6]}
              style={{
                borderRight: "1px solid black",
              }}
            >
              <Text>
                {card.classroom.min.toFixed(2)}/{card.classroom.max.toFixed(2)}
              </Text>
            </TableCell>
            <TableCell
              w={W[7]}
              style={{
                textTransform: "uppercase",
              }}
            >
              <Text> Moyen</Text>
            </TableCell>
          </TableRow>
        );
      })}

      <TableRow
        style={{
          backgroundColor: "#D7D7D7",
          fontSize: 8,
          fontWeight: "bold",
          borderBottom: "1px solid black",
        }}
      >
        <TableCell
          style={{
            paddingHorizontal: "4px",
            paddingVertical: "1px",
            alignItems: "flex-start",
            borderRight: 0,
          }}
          w={0.49}
        >
          <Text>{group.name}</Text>
        </TableCell>
        <TableCell
          style={{
            justifyContent: "center",
            borderLeft: 0,
            borderRight: 0,
          }}
          w={0.06}
        >
          <Text>{sum(cards.map((c) => c.coefficient))}</Text>
        </TableCell>
        <TableCell
          style={{
            justifyContent: "center",
            borderLeft: 0,
            borderRight: 0,
          }}
          w={0.34}
        >
          <Text>
            Point:{" "}
            {sum(cards.map((c) => (c.avg || 0) * c.coefficient)).toFixed(1)}/
            {sum(cards.map((c) => 20 * c.coefficient)).toFixed(1)}
          </Text>
        </TableCell>
        <TableCell
          style={{
            justifyContent: "center",
            borderLeft: 0,
          }}
          w={0.2}
        >
          <Text>
            Moyenne :
            {(
              sum(cards.map((c) => c.avg * c.coefficient)) /
              sum(cards.map((c) => c.coefficient))
            ).toFixed(2)}
          </Text>
        </TableCell>
      </TableRow>
    </>
  );
}
