import type { Style } from "@react-pdf/types";
import { Image, Text, View } from "@react-pdf/renderer";
import i18next from "i18next";

import type { RouterOutputs } from "@repo/api";

export function IPBWStudentInfo({
  student,
  contact,
}: {
  student: RouterOutputs["student"]["get"];
  contact: RouterOutputs["student"]["getPrimaryContact"];
}) {
  const classroom = student.classroom;

  let naiss =
    student.dateOfBirth &&
    Intl.DateTimeFormat(i18next.language, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(student.dateOfBirth);
  naiss += " à " + student.placeOfBirth;
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 2,
        alignItems: "flex-start",
        paddingVertical: "4px",
      }}
    >
      {student.avatar ? (
        <Image
          style={{
            width: 70,
            height: "100%",
          }}
          src={{
            uri: student.avatar,
            method: "GET",
            headers: { "Cache-Control": "no-cache" },
            body: "",
          }}
        />
      ) : (
        <View
          style={{
            width: 70,
            fontWeight: "bold",
            height: "100%",
            border: "1px solid gray",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Text style={{ fontSize: 10 }}>PHOTO</Text>
        </View>
      )}
      <View
        style={{
          fontSize: 8,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid black",
          }}
        >
          <InfoItem
            w={0.8}
            label={"Nom et Prénoms"}
            value={student.lastName + " " + student.firstName}
          />
          <InfoItem
            w={0.2}
            label={"Classe"}
            value={student.classroom?.name ?? ""}
            lastColumn={true}
          />
        </View>
        <View
          style={{
            borderBottom: "1px solid black",
            flexDirection: "row",
            display: "flex",
          }}
        >
          <InfoItem
            w={0.7}
            label={"Date et lieu de naissance"}
            value={naiss?.toString() ?? ""}
          />
          <InfoItem
            w={0.15}
            label={"Genre"}
            value={student.gender == "female" ? "F" : "M"}
          />
          <InfoItem
            w={0.15}
            label={"Effectif"}
            value={classroom?.size.toString() ?? ""}
            lastColumn={true}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            borderBottom: "1px solid black",
          }}
        >
          <InfoItem
            style={{ borderBottom: "1px solid black" }}
            w={0.4}
            label={"Identifiant Unique"}
            value="HIWJU34"
          />
          <InfoItem
            w={0.2}
            label={"Redoublant"}
            style={{
              borderBottom: "1px solid black",
            }}
            value={student.isRepeating ? "OUI" : "NON"}
          />

          <InfoItem
            lastColumn={true}
            w={0.4}
            label={"Professeur Principal"}
            value={""}
          />
        </View>
        <View>
          <InfoItem
            w={0.605}
            label={"Parents / Tuteurs"}
            value={contact?.contact.lastName ?? ""}
          />
          <View
            style={{
              alignItems: "flex-start",
              paddingLeft: 4,
              width: 4,
            }}
          >
            <Text>
              {classroom?.headTeacher?.prefix}{" "}
              {classroom?.headTeacher?.lastName}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function InfoItem({
  label,
  value,
  w,
  lastColumn = false,
  style,
}: {
  label: string;
  value: string;
  style?: Style;
  w: number;
  lastColumn?: boolean;
}) {
  return (
    <View
      style={{
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 4,
        flexDirection: "row",
        display: "flex",
        gap: 2,
        width: w,
        borderRight: lastColumn ? "" : "1px solid black",
        ...style,
      }}
    >
      <Text style={{ fontWeight: "bold" }}>
        {label}
        {value ? ":" : ""}
      </Text>{" "}
      <Text>{value}</Text>
    </View>
  );
}
