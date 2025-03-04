import { Image, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

export function ReportCardHeader({
  school,
}: {
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 2,
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>MINESEC/DRES</Text>
        <Text>DEDES-MAF</Text>
        <Text style={{ fontWeight: "bold" }}>{school.name}</Text>
        <Text>P.O. BOX 5062 YAOUNDE</Text>
        <Text>Phone N°: +237691045982</Text>
        <Text>{"     "} +237677281244</Text>
      </View>
      {school.logo && (
        <Image
          src={school.logo}
          style={{
            width: 125,
            height: 78,
          }}
        />
      )}
      <View
        style={{
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Text>Republic of Cameroon</Text>
        <Text>Peace - Work - Fatherland</Text>
        <Text>********************</Text>
      </View>
    </View>
  );
}
