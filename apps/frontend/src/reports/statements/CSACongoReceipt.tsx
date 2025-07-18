import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { decode } from "entities";
import i18next from "i18next";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

import { getAssetUrl } from "../utils";

const imageUrl = getAssetUrl("images");

export function CSACongoReceipt({
  amountInWords,
  transaction,
  school,
  info,
}: {
  amountInWords: string;
  transaction: NonNullable<RouterOutputs["transaction"]["get"]>;
  info: RouterOutputs["transaction"]["getReceiptInfo"];
  school: RouterOutputs["school"]["getSchool"];
}) {
  const {
    student,
    createdBy,
    printedBy,
    //receivedBy,
    classroom,
    contact,
    remaining,
  } = info;

  const numberOfReceipts = school.numberOfReceipts ?? 1;
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
        {Array.from({ length: numberOfReceipts }).map((_, index) => {
          return (
            <View
              key={index}
              style={{
                border: "1px solid black",
                padding: 10,
                marginBottom: 30,
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginBottom: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ textTransform: "uppercase" }}>
                    C.SC. ADVENTISTE DE BRAZZAVILLE
                  </Text>
                  <Text>{school.phoneNumber1}</Text>
                </View>

                {school.logo && (
                  <Image
                    src={`${imageUrl}/${school.logo}`}
                    style={{
                      width: 80,
                      height: 80,
                    }}
                  />
                )}
                <View>
                  <Text>BP : 5062 BRAZZAVILLE / CONGO</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                <Text>{transaction.transactionRef}</Text>

                <Text>
                  {decode(student.lastName ?? "")}{" "}
                  {decode(student.firstName ?? "")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "column", gap: 4 }}>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Text style={{ fontWeight: "bold" }}>POUR : </Text>
                    <Text>{transaction.description}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Text style={{ fontWeight: "bold" }}>MONTANT : </Text>
                    <Text>
                      {transaction.amount.toLocaleString(i18next.language, {
                        currency: school.currency,
                        style: "currency",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      })}{" "}
                      ({amountInWords})
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Text style={{ fontWeight: "bold" }}>RESTE : </Text>
                    <Text>
                      {remaining.toLocaleString(i18next.language, {
                        currency: school.currency,
                        style: "currency",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      })}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "column", gap: 4 }}>
                  <Text> {classroom.name}</Text>
                  <View
                    style={{
                      fontWeight: "bold",
                      border: "1px solid black",
                      padding: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Text>MONTANT : # {transaction.amount} #</Text>
                  </View>

                  <Text>
                    S/C : {contact?.prefix} {contact?.lastName}{" "}
                    {contact?.phoneNumber1}
                  </Text>
                </View>
              </View>

              {/* Footer */}
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Enregistré par : {createdBy?.lastName}</Text>
                <Text>
                  Imprimé par {printedBy?.lastName} le{" "}
                  {(transaction.printedAt ?? new Date()).toLocaleDateString()}
                </Text>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
export default CSACongoReceipt;
