import { Text, View } from "@alexandernanberg/react-pdf-renderer";
import { sortBy, sum } from "lodash";

import type { RouterOutputs } from "@repo/api";

import { ReportCardHeader } from "../headers/ReportCardHeader";
import { Table, TableCell, TableHeader, TableRow } from "../table";
import { IPBWStudentInfo } from "./IPBWStudentInfo";
import { IPBWSummary } from "./IPBWSummary";

const W = [0.4, 0.06, 0.06, 0.06, 0.06, 0.06, 0.1, 0.2];
type ReportCardType =
  RouterOutputs["reportCard"]["getStudent"]["result"][number];
export function IPBW({
  school,
  student,
  groups,
}: {
  groups: Record<number, ReportCardType[]>;
  student: RouterOutputs["student"]["get"];

  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
}) {
  return (
    <View style={{ flexDirection: "column" }}>
      <ReportCardHeader school={school} />
      <IPBWStudentInfo student={student} />
      <Table
        weightings={[0.4, 0.06, 0.06, 0.06, 0.06, 0.06, 0.1, 0.2]}
        style={
          {
            //paddingVertical: "0px",
            //paddingHorizontal: "2px",
          }
        }
      >
        <ReportTableHeader />
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
                Prof. Principal
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
                gap: 1,
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
                justifyContent: "center",
                flexDirection: "column",
                display: "flex",
                paddingVertical: 4,
                gap: 1,
              }}
            >
              <Text> {!card.isAbsent && card.avg}</Text>
            </TableCell>
            <TableCell
              w={W[2]}
              style={{
                justifyContent: "center",
              }}
            >
              {!card.isAbsent && card.coefficient}
            </TableCell>
            <TableCell
              w={W[3]}
              style={{
                justifyContent: "center",
              }}
            >
              <Text>
                {" "}
                {!card.isAbsent && (card.avg * card.coefficient).toFixed(2)}
              </Text>
            </TableCell>
            <TableCell
              style={{
                justifyContent: "center",
              }}
            >
              {!card.isAbsent && card.rank}
            </TableCell>
            <TableCell
              style={{
                justifyContent: "center",
              }}
            >
              {card.classroom.avg.toFixed(2)}
            </TableCell>
            <TableCell
              style={{
                justifyContent: "center",
              }}
            >
              {card.classroom.min.toFixed(2)}/{card.classroom.max.toFixed(2)}
            </TableCell>
            <TableCell
              style={{
                textTransform: "uppercase",
                //justifyContent: "center",
              }}
            >
              Moyen
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
            borderRight: 0,
          }}
          w={0.49}
        >
          {group.name}
        </TableCell>
        <TableCell
          style={{
            justifyContent: "center",
            borderLeft: 0,
            borderRight: 0,
          }}
          w={0.06}
        >
          {sum(cards.map((c) => c.coefficient))}
        </TableCell>
        <TableCell
          style={{
            justifyContent: "center",
            borderLeft: 0,
            borderRight: 0,
          }}
          w={0.34}
        >
          Point:{" "}
          {sum(cards.map((c) => (c.avg || 0) * c.coefficient)).toFixed(1)}/
          {sum(cards.map((c) => 20 * c.coefficient)).toFixed(1)}
        </TableCell>
        <TableCell
          style={{
            justifyContent: "center",
            borderLeft: 0,
          }}
          w={0.2}
        >
          Moyenne :
          {(
            sum(cards.map((c) => c.avg * c.coefficient)) /
            sum(cards.map((c) => c.coefficient))
          ).toFixed(2)}
        </TableCell>
      </TableRow>
    </>
  );
}

export function ReportTableHeader() {
  return (
    <TableHeader
      style={{
        backgroundColor: "#000",
        color: "#fff",
        borderBottom: "1px solid black",
        fontWeight: "bold",
        fontSize: 8,
      }}
    >
      <TableCell
        w={W[0]}
        style={{
          padding: 2,
        }}
      >
        Matieres
      </TableCell>
      <TableCell
        w={W[1]}
        style={{
          padding: 2,
        }}
      >
        Note
      </TableCell>
      <TableCell
        w={W[2]}
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Coef.
      </TableCell>
      <TableCell
        w={W[3]}
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Total
      </TableCell>
      <TableCell
        w={W[4]}
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Rang
      </TableCell>
      <TableCell
        w={W[5]}
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Moy.C
      </TableCell>
      <TableCell
        w={W[6]}
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Min/Max
      </TableCell>
      <TableCell
        w={W[7]}
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Appreciation
      </TableCell>
    </TableHeader>
  );
}
