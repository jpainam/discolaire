import { Document, Image, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

import type { Style } from "@react-pdf/stylesheet";

import { IPBWHeader } from "../headers/IPBWHeader";

export function StudentPage({
  student,
  school,
}: {
  student: RouterOutputs["student"]["get"];
  school: RouterOutputs["school"]["getSchool"];
}) {
  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 40,
          fontSize: 7,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Roboto",
        }}
      >
        <View style={{ flexDirection: "column", display: "flex", gap: 6 }}>
          <IPBWHeader school={school} />

          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 12,
            }}
          >
            Profile de l'élève
          </Text>

          {student.avatar && <Image src={student.avatar} />}

          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item
              style={{ width: "50%" }}
              label="Matricule"
              value={student.registrationNumber}
            />
            <Item
              style={{ width: "50%" }}
              label="Nom et Prenom"
              value={`${student.firstName} ${student.lastName}`}
            />
          </View>

          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item
              style={{ width: "50%" }}
              label="Date de naissance"
              value={student.dateOfBirth?.toLocaleDateString()}
            />
            <Item
              style={{ width: "50%" }}
              label="Lieu de naissance"
              value={student.placeOfBirth}
            />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item label={"Residence"} value={student.residence} />
            <Item
              style={{ width: "50%" }}
              label="Sexe"
              value={student.gender == "female" ? "F" : "M"}
            />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item label={"Status"} value={student.status} />
            <Item label="Religion" value={student.religion?.name} />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item label={"Tel"} value={student.phoneNumber} />
            <Item label="Email" value={student.email} />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item label={"Group sanguin"} value={student.bloodType} />
          </View>

          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item
              label={"Date d'entree"}
              value={student.dateOfEntry?.toLocaleDateString()}
            />
            <Item
              label={"Date de sortie"}
              value={student.dateOfExit?.toLocaleDateString()}
            />
          </View>

          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item label={"Classe"} value={student.classroom?.name} />
            <Item label={"Niveau"} value={student.classroom?.level.name} />
          </View>

          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item
              label={"Achievements"}
              value={student.achievements.join(", ")}
            />
            <Item label={"Tuteur"} value={student.hobbies.join(", ")} />
          </View>
          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 12,
            }}
          >
            Parents de l'élève
          </Text>
        </View>
      </Page>
    </Document>
  );
}

function Item({
  value,
  label,
  style,
}: {
  value?: string | null;
  label: string;
  style?: Style;
}) {
  return (
    <View
      style={{
        display: "flex",
        width: "50%",
        flexDirection: "column",
        gap: 1,
        ...style,
      }}
    >
      <Text style={{ fontSize: 10, fontWeight: "bold" }}>{label}</Text>
      <Text style={{ fontSize: 8 }}>{value ?? "..."}</Text>
    </View>
  );
}
export default StudentPage;
