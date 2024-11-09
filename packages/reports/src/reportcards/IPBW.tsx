import { Text, View } from "@alexandernanberg/react-pdf-renderer";
import { sortBy, sum } from "lodash";

import type { RouterOutputs } from "@repo/api";

import { ReportCardHeader } from "../headers/ReportCardHeader";

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
    <View
      style={{
        flexDirection: "column",
        gap: 2,
        alignItems: "flex-start",
      }}
    >
      <ReportCardHeader school={school} />
      <View style={{ flexDirection: "column" }}>
        {Object.keys(groups).map((groupId: string) => {
          let cards = groups[Number(groupId)];
          if (!cards || cards.length == 0) return null;
          cards = sortBy(cards, "order").filter((c) => !c.isAbsent);
          const card = cards[0];
          if (!card) return null;
          const group = card.subjectGroup;
          if (!group) return null;

          return (
            <View key={`fragment-${groupId}`}>
              <ReportCardGroup
                groupId={Number(groupId)}
                key={`card-${groupId}`}
                cards={cards}
              />
              <View
                style={{
                  flexDirection: "row",
                  border: 1,
                  borderColor: "black",
                }}
                key={`recap-${groupId}`}
              >
                <Text>{group.name}</Text>
                <Text>{sum(cards.map((c) => c.coefficient))}</Text>
                <Text>
                  Point:{" "}
                  {sum(cards.map((c) => (c.avg || 0) * c.coefficient)).toFixed(
                    1,
                  )}{" "}
                  / {sum(cards.map((c) => 20 * c.coefficient)).toFixed(1)}
                </Text>
                <Text>
                  Moyenne :
                  {(
                    sum(cards.map((c) => c.avg * c.coefficient)) /
                    sum(cards.map((c) => c.coefficient))
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function ReportCardGroup({
  cards,
  groupId,
}: {
  groupId: number;
  cards: ReportCardType[];
}) {
  return (
    <>
      {cards.map((card, index) => {
        return (
          <View
            style={{ flexDirection: "row", border: 1 }}
            key={`card-${groupId}-${index}`}
          >
            <View style={{ flexDirection: "column" }}>
              <Text>{card.course.name}</Text>
              <Text>
                {card.teacher?.prefix} {card.teacher?.lastName}
              </Text>
            </View>

            <Text>{!card.isAbsent && card.avg}</Text>
            <Text>{!card.isAbsent && card.coefficient}</Text>
            <Text>
              {!card.isAbsent && (card.avg * card.coefficient).toFixed(2)}
            </Text>
            <Text>{!card.isAbsent && card.rank}</Text>
            <Text>{card.classroom.avg.toFixed(2)}</Text>
            <Text>
              {card.classroom.min.toFixed(2)} / {card.classroom.max.toFixed(2)}
            </Text>
            <Text>Moyen</Text>
          </View>
        );
      })}
    </>
  );
}
