import { Image, Text, View } from "@react-pdf/renderer";

import "../fonts";

import type { Style } from "@react-pdf/stylesheet";

import type { RouterOutputs } from "@repo/api";

import { getAssetUrl } from "../utils";

const imageUrl = getAssetUrl("images");

export function CSACongoHeader({
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
        gap: 1,
        fontSize: 6,
        alignItems: "flex-start",
        marginBottom: "5px",
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
          République du Congo
        </Text>

        <Text
          style={{
            textTransform: "uppercase",
          }}
        >
          Ministère des enseignements primaire et secondaires
        </Text>
        <DashStart />
        <Text
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          {/* {school.region} */}
          Délégation Regionale du Centre
        </Text>
        <DashStart />
        <Text
          style={{
            textTransform: "uppercase",
          }}
        >
          {/* {school.department} */}
          Brazzaville, Délégation Regionale du Centre
        </Text>
        <DashStart />
        <Text style={{ textTransform: "uppercase" }}>
          {/* {school.name} */}
          COMPLEXE SCOLAIRE ADVENTISTE DE BRAZZAVILLE
        </Text>
        <Text>BP: 5062 Brazzaville</Text>
        <Text>Tél: +24269632025</Text>
        <Text>(Principal) (+237) 699474456 / 671690331</Text>
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
          Republic du Congo
        </Text>
        <Text
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
          }}
        >
          Unité - Travail - Progrès
        </Text>
        <DashStart />
        <Text
          style={{
            textTransform: "uppercase",
          }}
        >
          Ministry of Secondary Education
        </Text>
      </View>
    </View>
  );
}

function DashStart() {
  return <Text>********************</Text>;
}
