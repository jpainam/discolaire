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
          {/* {school.region} */}
          Délégation Régionale du Centre
        </Text>
        <DashStart />
        <Text
          style={{
            textTransform: "uppercase",
          }}
        >
          {/* {school.department} */}
          Délégation Départementale de la Mefou Afamba
        </Text>
        <DashStart />
        <Text style={{ textTransform: "uppercase" }}>
          {/* {school.name} */}
          Institut Polyvalent Bilingue Wague
        </Text>
        <Text>BP: 5062 YAOUNDE</Text>
        <Text>Tél: (Secrétariat) (+237) 693378043</Text>
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

        <Text
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          5JN2GWFD101667112
        </Text>
        <Text
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          5JM2WBD111319113
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
          Republic of Cameroon
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
        <Text style={{ textTransform: "uppercase" }}>
          WAGUE BILINGUAL COMPREHENSIVE INSTITUTE
          {/* {school.name} */}
        </Text>
        <Text>P.O Box: 5062 YAOUNDE</Text>
        <Text>Tel: (+237) 677281244 / 695226223</Text>
        <Text>Situated at NKOLFOULOU 1-Long street yaounde-Soa road</Text>
      </View>
    </View>
  );
}

function DashStart() {
  return <Text>********************</Text>;
}
