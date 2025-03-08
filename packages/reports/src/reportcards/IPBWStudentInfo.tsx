import type { Style } from "@react-pdf/types";
import { Image, Text, View } from "@react-pdf/renderer";
import i18next from "i18next";

import type { RouterOutputs } from "@repo/api";

export function IPBWStudentInfo({
  student,
  contact,
  classroom,
}: {
  student: {
    firstName: string | null;
    lastName: string | null;
    gender: string | null;
    dateOfBirth?: Date | null;
    placeOfBirth?: string | null;
    avatar?: string | null;
    isRepeating: boolean;
  };
  classroom: RouterOutputs["classroom"]["get"];
  contact: RouterOutputs["student"]["getPrimaryContact"];
}) {
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
            height: 60,
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
            height: 75,
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
          flexDirection: "column",
          border: "1px solid black",
          width: "100%",
        }}
      >
        {/* Name & Classroom */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid black",
          }}
        >
          <InfoItem
            style={{ width: "60%" }}
            label={"Nom et Prénoms"}
            value={student.lastName + " " + student.firstName}
          />
          <InfoItem label={"Classe"} value={classroom.name} lastColumn={true} />
        </View>
        {/* Datenaiss & Gender & Effectif */}
        <View
          style={{
            borderBottom: "1px solid black",
            flexDirection: "row",
            display: "flex",
          }}
        >
          <InfoItem
            style={{ width: "60%" }}
            label={"Date et lieu de naissance"}
            value={naiss?.toString() ?? ""}
          />
          <InfoItem
            style={{ width: "15%" }}
            label={"Genre"}
            value={student.gender == "female" ? "F" : "M"}
          />
          <InfoItem
            label={"Effectif"}
            value={classroom.size.toString()}
            lastColumn={true}
          />
        </View>
        {/* ID & Gender & Repeating & Principal */}

        <View
          style={{
            flexDirection: "row",
            display: "flex",
          }}
        >
          <InfoItem
            style={{ borderBottom: "1px solid black", width: "30%" }}
            label={"Identifiant Unique"}
            value="HIWJU34"
          />
          <InfoItem
            label={"Redoublant"}
            style={{
              borderBottom: "1px solid black",
              width: "30%",
            }}
            value={student.isRepeating ? "OUI" : "NON"}
          />
          <InfoItem
            lastColumn={true}
            label={"Professeur Principal"}
            value={""}
          />
        </View>
        {/* Parent/ Tutors& & Principal name */}

        <View
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <InfoItem
            label={"Parents / Tuteurs"}
            style={{ width: "60%" }}
            value={contact?.contact.lastName ?? ""}
          />
          {classroom.headTeacher && (
            <InfoItem
              lastColumn={true}
              label={""}
              value={`${classroom.headTeacher.prefix} ${classroom.headTeacher.lastName}`}
            />
          )}
          <Text></Text>
        </View>
      </View>
    </View>
  );
}

function InfoItem({
  label,
  value,
  lastColumn = false,
  style,
}: {
  label: string;
  value: string;
  style?: Style;
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
        borderRight: lastColumn ? "" : "1px solid black",
        ...style,
      }}
    >
      {label && value ? (
        <>
          <Text style={{ fontWeight: "bold" }}>
            {label}
            {":"}
          </Text>
          <Text>{value}</Text>
        </>
      ) : label ? (
        <Text style={{ fontWeight: "bold" }}>{label}</Text>
      ) : value ? (
        <Text>{value}</Text>
      ) : (
        <></>
      )}
    </View>
  );
}
