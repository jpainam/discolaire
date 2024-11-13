import { Text } from "@alexandernanberg/react-pdf-renderer";
import { sortBy, sum } from "lodash";

import type { RouterOutputs } from "@repo/api";

import { ReportCardHeader } from "../headers/ReportCardHeader";
import { Table, TableCell, TableHeader, TableRow } from "../table";

type ReportCardType =
  RouterOutputs["reportCard"]["getStudent"]["result"][number];
export function IPBW({
  school,
  groups,
}: {
  groups: Record<number, ReportCardType[]>;
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
}) {
  return (
    <>
      <ReportCardHeader school={school} />
      <Table
        weightings={[0.4, 0.06, 0.06, 0.06, 0.06, 0.06, 0.1, 0.2]}
        tdStyle={{
          paddingVertical: "1px",
          paddingHorizontal: "2px",
        }}
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
    </>
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
          <TableRow key={`card-${groupId}-${index}`}>
            <TableCell
              style={{
                flexDirection: "column",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{card.course.name}</Text>
              <Text style={{ paddingLeft: "8px" }}>
                {card.teacher?.prefix} {card.teacher?.lastName}
              </Text>
            </TableCell>

            <TableCell
              style={{
                justifyContent: "center",
              }}
            >
              {!card.isAbsent && card.avg}
            </TableCell>
            <TableCell
              style={{
                justifyContent: "center",
              }}
            >
              {!card.isAbsent && card.coefficient}
            </TableCell>
            <TableCell
              style={{
                justifyContent: "center",
              }}
            >
              {!card.isAbsent && (card.avg * card.coefficient).toFixed(2)}
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
                justifyContent: "center",
              }}
            >
              Moyen
            </TableCell>
          </TableRow>
        );
      })}
      <TableRow
        style={{ backgroundColor: "#D7D7D7", fontSize: 9, fontWeight: "bold" }}
      >
        <TableCell
          style={{
            paddingHorizontal: "5px",
            paddingVertical: "4px",
          }}
          weighting={0.46}
        >
          {group.name}
        </TableCell>
        <TableCell weighting={0.06}>
          {sum(cards.map((c) => c.coefficient))}
        </TableCell>
        <TableCell weighting={0.3}>
          Point:{" "}
          {sum(cards.map((c) => (c.avg || 0) * c.coefficient)).toFixed(1)} /
          {sum(cards.map((c) => 20 * c.coefficient)).toFixed(1)}
        </TableCell>
        <TableCell weighting={0.214}>
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
        backgroundColor: "#CCC",
        //color: "#fff",
        fontWeight: "bold",
        fontSize: 9,
      }}
    >
      <TableCell
        style={{
          paddingHorizontal: "2px",
          paddingVertical: "4px",
          fontWeight: "bold",
        }}
      >
        Matieres
      </TableCell>
      <TableCell
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Note
      </TableCell>
      <TableCell
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Coef.
      </TableCell>
      <TableCell
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Total
      </TableCell>
      <TableCell
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Rang
      </TableCell>
      <TableCell
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Moy.C
      </TableCell>
      <TableCell
        style={{
          justifyContent: "center",
          padding: "2px",
        }}
      >
        Min/Max
      </TableCell>
      <TableCell
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
