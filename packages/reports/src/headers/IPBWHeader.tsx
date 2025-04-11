import { Image, Text, View } from "@react-pdf/renderer";

import "../fonts";

import type { Style } from "@react-pdf/stylesheet";

import type { RouterOutputs } from "@repo/api";

import { getAssetUrl } from "../utils";

const imageUrl = getAssetUrl("images");

export function IPBWHeader({
  school,
  style,
}: {
  style?: Style;
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 2,
        fontSize: 7,
        alignItems: "flex-start",
        marginBottom: "8px",
        ...style,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textTransform: "uppercase",
          }}
        >
          République du Cameroun
        </Text>
        <Text
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
          }}
        >
          Paix - Travail - Patrie
        </Text>
        <DashStart />
        <Text
          style={{
            textTransform: "uppercase",
          }}
        >
          Ministère des Enseignements Secondaires
        </Text>
        <DashStart />
        <Text
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          {school.region}
        </Text>
        <DashStart />
        <Text
          style={{
            textTransform: "uppercase",
          }}
        >
          {school.department}
        </Text>
        <DashStart />
        <Text>{school.name}</Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {school.logo && (
          <Image
            src={`${imageUrl}/${school.logo}`}
            // src={{
            //   uri: "http://localhost:9310/images/cm1hbntgn00001h578bvyjxln.png",
            //   method: "GET",
            //   headers: { "Cache-Control": "no-cache" },
            //   body: "",
            // }}
            style={{
              width: 125,
              height: 80,
            }}
          />
        )}
        <Text
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          HWOFW
        </Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textTransform: "uppercase",
          }}
        >
          République du Cameroon
        </Text>
        <Text
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
          }}
        >
          Peace - Work - Fatherland
        </Text>
        <DashStart />
        <Text
          style={{
            textTransform: "uppercase",
          }}
        >
          Ministry of Secondary Education
        </Text>
        <DashStart />
        <Text
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          REGIONAL DELEGATION OF CENTER
        </Text>
        <DashStart />
        <Text
          style={{
            textTransform: "uppercase",
          }}
        >
          DIVISIONAL DELEGATION OF MEFOU AFAMBA
        </Text>
        <DashStart />
        <Text>{school.name}</Text>
      </View>
    </View>
  );
}

function DashStart() {
  return <Text>********************</Text>;
}
