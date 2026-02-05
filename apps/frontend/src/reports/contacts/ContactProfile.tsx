import type { Style } from "@react-pdf/stylesheet";
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getFullName } from "~/utils";
import { getHeader } from "../headers";
import { getAssetUrl } from "../utils";

export function ContactProfile({
  contact,
  school,
  studentContacts,
}: {
  contact: RouterOutputs["contact"]["get"];
  school: RouterOutputs["school"]["getSchool"];
  studentContacts: RouterOutputs["contact"]["students"];
}) {
  const avatarDataUri = contact.avatar
    ? `${getAssetUrl("avatar")}/${contact.avatar}`
    : null;
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
          fontFamily: "Helvetica",
        }}
      >
        <View style={{ flexDirection: "column", display: "flex", gap: 6 }}>
          {getHeader(school, { fontSize: 7 })}

          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 12,
            }}
          >
            Profil du Parent
          </Text>

          {avatarDataUri && (
            <Image style={{ width: 100, height: 100 }} src={avatarDataUri} />
          )}

          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item
              style={{ width: "100%" }}
              label="Nom et Prenom"
              value={getFullName(contact)}
            />
          </View>

          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item
              style={{ width: "50%" }}
              label="Profession"
              value={contact.occupation}
            />
            <Item
              style={{ width: "50%" }}
              label="Employer"
              value={contact.employer}
            />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item label={"Email"} value={contact.email} />
            <Item label="Phone Number 1" value={contact.phoneNumber1} />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item label={"address"} value={contact.address} />
            <Item
              style={{ width: "50%" }}
              label="Sexe"
              value={contact.gender == "female" ? "F" : "M"}
            />
          </View>

          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Item
              label={"Status"}
              value={contact.isActive ? "Actif" : "Desactivé"}
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
            Elèves
          </Text>
          {studentContacts.map((std, index) => {
            const student = std.student;
            return (
              <View
                key={`${student.id}-${index}`}
                style={{
                  flexDirection: "column",
                  gap: 2,
                  display: "flex",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Elève {index + 1}</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                  }}
                >
                  <View style={{ width: "40%" }}>
                    <Text>{getFullName(student)}</Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Text>{student.classroom?.name}/</Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Text>{std.relationship?.name}</Text>
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
