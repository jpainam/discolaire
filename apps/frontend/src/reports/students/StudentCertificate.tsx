import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getFullName } from "~/utils";
import { getHeader } from "../headers";

export function StudentCertificate({
  student,
  schoolYear,
  school,
}: {
  student: RouterOutputs["student"]["get"];
  school: RouterOutputs["school"]["getSchool"];
  schoolYear: RouterOutputs["schoolYear"]["getCurrent"];
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
          fontFamily: "Helvetica",
        }}
      >
        <View style={{ flexDirection: "column", display: "flex", gap: 6 }}>
          {getHeader(school, { fontSize: 7 })}
          <View
            style={{ marginTop: 25, marginBottom: 30, alignItems: "center" }}
          >
            <Text
              style={{
                fontWeight: "bold",
                alignSelf: "center",
                fontSize: 30,
              }}
            >
              CERTIFICAT DE SCOLARITE
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 15,
              gap: 15,
            }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
              <Text>Je soussigné </Text>
              <Text style={{ fontWeight: "bold" }}>
                Monsieur DAMI KEMADJOU BERTRAND BLAISE,
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text>Principal de l'</Text>
              <Text>Institut Polyvalent Bilingue WAGUE</Text>
            </View>
            <View>
              <Text>Certifie par la présente que :</Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                {student.gender == "female" ? "Mle" : "M."}{" "}
                {getFullName(student)}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Text>Né(e) le</Text>
              <Text style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                {student.dateOfBirth?.toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text>à</Text>
              <Text style={{ fontWeight: "bold" }}>{student.placeOfBirth}</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                rowGap: 10,
                gap: 2,
              }}
            >
              <Text style={{ rowGap: 10 }}>
                Est inscrit(e) dans les régistres de notre établissement pour le
                compte de
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text>L'année scolaire {schoolYear.name} en classe de </Text>
              <Text style={{ fontWeight: "bold" }}>
                {student.classroom?.name}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text>Sous le numéro matricule : </Text>
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                {student.registrationNumber}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 25,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              fontSize: 15,
            }}
          >
            <Text>
              En foi de quoi, la présente attestation est établie pour servir et
              valoir ce que de droit.
            </Text>
          </View>
          <View style={{ marginTop: 10, alignItems: "flex-end" }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                textTransform: "capitalize",
              }}
            >
              Nkolfoulou,{" "}
              {new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={{ marginTop: 10, alignItems: "flex-end" }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                textDecoration: "underline",
              }}
            >
              Le Principal
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
