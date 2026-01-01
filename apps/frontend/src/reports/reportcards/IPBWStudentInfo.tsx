import type { Style } from "@react-pdf/types";
import { Image, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getAssetUrl } from "../utils";
import { getTranslation } from "./translation";

export function IPBWStudentInfo({
  student,
  contact,
  classroom,
  lang,
}: {
  student: {
    firstName: string | null;
    lastName: string | null;
    gender: string | null;
    dateOfBirth?: Date | null;
    placeOfBirth?: string | null;
    avatar?: string | null;
    isRepeating: boolean;
    registrationNumber: string | null;
  };
  lang: "fr" | "en";
  classroom: RouterOutputs["classroom"]["get"];
  contact: RouterOutputs["student"]["getPrimaryContact"];
}) {
  const t = getTranslation(lang);
  const avatarDataUri = student.avatar
    ? `${getAssetUrl("avatar")}/${student.avatar}`
    : null;
  let naiss =
    student.dateOfBirth &&
    Intl.DateTimeFormat(classroom.section?.name == "ANG" ? "en" : "fr", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(student.dateOfBirth);
  naiss += "  " + t("à") + " " + student.placeOfBirth;
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 2,
        alignItems: "flex-start",
        paddingVertical: "4px",
      }}
    >
      {avatarDataUri ? (
        <View
          style={{
            width: 100,
            height: 72,
            border: "1px solid black",
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
            }}
            src={avatarDataUri}
          />
        </View>
      ) : (
        <View
          style={{
            width: 70,
            fontWeight: "bold",
            height: 65,
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
            label={t("Nom et Prénoms")}
            value={student.lastName + " " + student.firstName}
          />
          <InfoItem
            label={t("Classe")}
            value={classroom.name}
            lastColumn={true}
          />
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
            label={t("Date et lieu de naissance")}
            value={naiss?.toString() ?? ""}
          />
          <InfoItem
            style={{ width: "15%" }}
            label={t("Genre")}
            value={student.gender == "female" ? "F" : "M"}
          />
          <InfoItem
            label={t("Effectif")}
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
            label={t("Identifiant Unique")}
            value={student.registrationNumber ?? ""}
          />
          <InfoItem
            label={t("Redoublant")}
            style={{
              borderBottom: "1px solid black",
              width: "30%",
            }}
            value={student.isRepeating ? t("OUI") : t("NON")}
          />
          <InfoItem
            lastColumn={true}
            label={t("Professeur Principal")}
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
            label={t("Parents / Tuteurs")}
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
