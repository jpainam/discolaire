import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { decode } from "entities";

import type { RouterOutputs } from "@repo/api";

import { formatCurrency, getAssetUrl } from "../utils";

const imageUrl = getAssetUrl("image");

const styles = StyleSheet.create({
  page: {
    position: "relative", // Context for absolute positioning
  },
  watermarkContainer: {
    position: "absolute",
    top: "10%",
    left: "15%",
    opacity: 0.1,
    zIndex: -1, // Place behind other content
  },
  watermarkImage: {
    width: 450,
    height: 350,
    //transform: "rotate(-45deg)", // Optional: for diagonal effect
  },
});

export function IPBWReceipt({
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
          fontFamily: "Helvetica",
        }}
      >
        {Array.from({ length: numberOfReceipts }).map((_, index) => {
          return (
            <>
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
                      {school.name}
                    </Text>
                    <Text>{school.phoneNumber1}</Text>
                  </View>

                  {school.logo && (
                    <Image
                      src={`${imageUrl}/${school.logo}`}
                      style={{
                        width: 125,
                        height: 80,
                      }}
                    />
                  )}
                  <View>
                    <Text>BP : 5062 YAOUNDE / CAMEROUN</Text>
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
                        {formatCurrency(transaction.amount)} ({amountInWords})
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 4 }}>
                      <Text style={{ fontWeight: "bold" }}>RESTE : </Text>
                      <Text>{formatCurrency(remaining)}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "column", gap: 4 }}>
                    <Text>
                      {classroom.name} / {transaction.journal?.name}
                    </Text>
                    <View
                      style={{
                        fontWeight: "bold",
                        border: "1px solid black",
                        padding: 5,
                        borderRadius: 5,
                      }}
                    >
                      <Text>
                        MONTANT : # {formatCurrency(transaction.amount)} #
                      </Text>
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
            </>
          );
        })}
        <View style={styles.watermarkContainer}>
          <Image
            src={`${imageUrl}/${school.logo}`}
            style={styles.watermarkImage}
          />
        </View>
      </Page>
    </Document>
  );
}
export default IPBWReceipt;
