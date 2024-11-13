import { Image, Text, View } from "@react-pdf/renderer";
import i18next from "i18next";

import type { RouterOutputs } from "@repo/api";

export function IPBWStudentInfo({
  student,
}: {
  student: RouterOutputs["student"]["get"];
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
    <View style={{ flexDirection: "column", paddingVertical: "4px" }}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 10,
        }}
      >
        BULLETIN DE NOTES DU PREMIER TRIMESTRE
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignContent: "flex-start",
          justifyContent: "space-between",
          paddingTop: "10px",
          fontSize: 9,
        }}
      >
        {student.avatar && (
          <Image
            style={{
              width: 100,
              height: 65,
            }}
            src={student.avatar}
          />
        )}
        <View style={{ flexDirection: "column" }}>
          <InfoItem name="Matricule" value={student.registrationNumber} />
          <InfoItem
            name="Nom et Prénom"
            value={student.lastName + " " + student.firstName}
          />
          <InfoItem name="Née le" value={naiss} />
          <InfoItem name="Sexe" value={student.gender} />
        </View>
        <View style={{ flexDirection: "column" }}>
          <InfoItem name="Classe" value={student.classroom?.name} />
          <InfoItem name="Effectif" value={classroom?.size.toString() ?? ""} />
          <InfoItem
            name="Redoublant"
            value={student.isRepeating ? "OUI" : "NON"}
          />
          <InfoItem name="Annee Scolaire" value={classroom?.schoolYear.name} />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
          fontWeight: "bold",
        }}
      >
        <Text>Enseignant Principal</Text>
        <Text>
          {classroom?.headTeacher?.prefix}{" "}
          {classroom?.headTeacher?.lastName +
            " " +
            classroom?.headTeacher?.firstName}
        </Text>
      </View>
    </View>
  );
}

function InfoItem({ name, value }: { name: string; value?: string | null }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={{ fontWeight: "bold", width: "100px" }}>{name}: </Text>
      <Text>{value}</Text>
    </View>
  );
}
