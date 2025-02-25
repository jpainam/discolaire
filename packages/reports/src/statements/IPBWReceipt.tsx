import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  schoolDetails: {
    textAlign: "center",
  },
  amountBox: {
    border: "1px solid black",
    padding: 5,
    alignSelf: "center",
    marginTop: 10,
  },
  content: {
    marginTop: 20,
  },
  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export function IPBWReceipt({
  transaction,
  size = "a4",
  school,
  contacts,
  student,
}: {
  transaction: NonNullable<RouterOutputs["transaction"]["get"]>;
  size: "a4" | "letter";
  student: RouterOutputs["student"]["get"];
  school: RouterOutputs["school"]["getSchool"];
  contacts: RouterOutputs["student"]["contacts"];
}) {
  let contact = contacts.find((c) => c.primaryContact)?.contact;
  if (!contact) {
    contact = contacts[0]?.contact;
  }
  const numberOfReceipts = 3; //school.numberOfReceipts ?? 1
  return (
    <Document>
      <Page
        size={size.toUpperCase() as "LETTER" | "A4"}
        style={{
          padding: 20,
          backgroundColor: "#fff",
          fontSize: 9,
          fontFamily: "Helvetica",
          color: "#000",
        }}
      >
        {Array.from({ length: numberOfReceipts }).map((_, index) => {
          return (
            <View
              key={index}
              style={{
                border: "1px solid black",
                padding: 10,
                marginBottom: 35,
              }}
            >
              <View style={styles.header}>
                <Text style={{ textTransform: "uppercase" }}>
                  {school.name}
                </Text>
                <Text>BP : 5062 YAOUNDE / CAMEROUN</Text>
              </View>
              <View style={styles.schoolDetails}>
                <Text>+23797868499</Text>
                <Text>
                  {student.lastName} {student.firstName}
                </Text>
                <Text>{transaction.transactionRef}</Text>
                <Text>Classe: {student.classroom?.name}</Text>
              </View>

              {/* Amount Section */}
              <View style={styles.amountBox}>
                <Text>MONTANT : # {transaction.amount} #</Text>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text>POUR:{transaction.description}</Text>
                <Text>MONTANT : 50 000 CFA (cinquante mille)</Text>
                <Text>RESTE : -50000 CFA</Text>
                <Text>
                  S/C : {contact?.prefix} {contact?.lastName}
                </Text>
                <Text>{contact?.phoneNumber1}</Text>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text>Enregistré par : M. Administrateur</Text>
                <Text>Imprimé par M. Administrateur le 19 Nov 2024 12:21</Text>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
