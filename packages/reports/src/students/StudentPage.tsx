import { Document, Image, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

import type { Style } from "@react-pdf/stylesheet";

import { IPBWHeader } from "../headers/IPBWHeader";

export function StudentPage({
  student,
  contacts,
  school,
}: {
  student: RouterOutputs["student"]["get"];
  contacts: RouterOutputs["student"]["contacts"];
  school: RouterOutputs["school"]["getSchool"];
}) {
  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 40,
          fontSize: 10,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Roboto",
        }}
      >
        <View style={{ flexDirection: "column", display: "flex", gap: 6 }}>
          <IPBWHeader
            style={{
              fontSize: 7,
            }}
            school={school}
          />

          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 12,
            }}
          >
            Profil de l'élève
          </Text>

          {student.avatar && (
            <Image
              style={{ width: 100, height: 100 }}
              // src={{
              //   uri: student.avatar,
              //   method: "GET",
              //   headers: { "Cache-Control": "no-cache" },
              //   body: "",
              // }}
              src={student.avatar}
            />
          )}

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
            <Item label={"Classe"} value={student.classroom?.name} />
            <Item
              label="Redoublant"
              value={student.isRepeating ? "OUI" : "NON"}
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
            <Item label={"No. Sun+"} value={student.sunPlusNo} />
            <Item label="Ancienne école" value={student.formerSchool?.name} />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item
              label={"Baptisé"}
              value={student.isBaptized ? "OUI" : "NON"}
            />
            <Item label={"Group sanguin"} value={student.bloodType} />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item label={"Tel"} value={student.phoneNumber} />
            <Item label="Email" value={student.email} />
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
            <Item
              label={"Achievements"}
              value={student.achievements.join(", ")}
            />
            <Item label={"Hobbies"} value={student.hobbies.join(", ")} />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item
              label={"Clubs"}
              value={student.clubs.map((c) => c.club.name).join(", ")}
            />
            <Item
              label={"Reseau sociaux"}
              value={student.socialMedias.join(",")}
            />
          </View>
          <View
            style={{
              borderBottom: "1px solid black",
              width: "100%",
              marginVertical: 5,
            }}
          />
          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 12,
            }}
          >
            Parents de l'élève
          </Text>
          {contacts.map((contact, index) => {
            return (
              <View
                key={`${contact.contactId}-${index}`}
                style={{
                  flexDirection: "column",
                  gap: 2,
                  display: "flex",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Parent {index + 1}</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                  }}
                >
                  <View style={{ width: "40%" }}>
                    <Text>
                      {contact.contact.lastName} {contact.contact.firstName}
                    </Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Text>
                      {contact.contact.phoneNumber1}/{contact.contact.email}
                    </Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Text>{contact.relationship?.name}</Text>
                  </View>
                </View>
              </View>
            );
          })}
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
