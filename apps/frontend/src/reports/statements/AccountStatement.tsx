import { Document, Font, Page, Text, View } from "@react-pdf/renderer";
import { getMonth } from "date-fns";
import { decode } from "entities";
import QRCodeUtil from "qrcode";

import "../fonts";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

// const CDN_URL = "https://discolaire-public.s3.eu-central-1.amazonaws.com";

// Font.register({
//   family: "GeistMono",
//   fonts: [
//     {
//       src: `${CDN_URL}/fonts/GeistMono/GeistMono-Regular.ttf`,
//       fontWeight: 400,
//     },
//     {
//       src: `${CDN_URL}/fonts/GeistMono/GeistMono-Medium.ttf`,
//       fontWeight: 500,
//     },
//   ],
// });
const CDN_URL = "https://cdn.midday.ai";

Font.register({
  family: "GeistMono",
  fonts: [
    {
      src: `${CDN_URL}/fonts/GeistMono/ttf/GeistMono-Regular.ttf`,
      fontWeight: 400,
    },
    {
      src: `${CDN_URL}/fonts/GeistMono/ttf/GeistMono-Medium.ttf`,
      fontWeight: 500,
    },
  ],
});

interface Props {
  student: NonNullable<RouterOutputs["student"]["get"]>;
  transactions: RouterOutputs["studentAccount"]["getStatements"];
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
}

export async function AcccountStatement({
  student,
  school,
  transactions,
}: Props) {
  // @ts-expect-error Fix this later
  const _qrCode = await QRCodeUtil.toDataURL(
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    {
      width: 40 * 3,
      height: 40 * 3,
      margin: 0,
    },
  );
  let balance = 0;
  let month = getMonth(new Date());

  //await new Promise((resolve) => setTimeout(resolve, 1000));

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
        <View style={{ flexDirection: "column", marginBottom: 40 }}>
          {getHeader(school, { fontSize: 7 })}

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 12,
              alignSelf: "center",
            }}
          >
            RELEVE DE COMPTE
          </Text>

          <View
            style={{
              marginVertical: 15,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
              {decode(student.lastName ?? "")} {decode(student.firstName ?? "")}
            </Text>
            <View style={{ flexDirection: "column", gap: 2 }}>
              <Text>N° compte : ABADAV004528 </Text>
              <Text>Date génération état : 25-Mar-25 </Text>
              <Text>Période : 2022-2023</Text>
            </View>
          </View>
          <View
            style={{
              fontFamily: "RobotoMono",
              borderTop: "1px solid black",
              borderBottom: "1px solid black",
              padding: 5,
              fontSize: 8,
              flexDirection: "column",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "10%", alignItems: "center" }}>
                <Text>Date</Text>
              </View>
              <View style={{ width: "10%", alignItems: "center" }}>
                <Text>Réf.Caisse</Text>
              </View>
              <View style={{ width: "20%", alignItems: "center" }}>
                <Text>Réf. transaction</Text>
              </View>
              <View style={{ width: "30%", alignItems: "center" }}>
                <Text>Libellé</Text>
              </View>
              <View style={{ width: "10%", alignItems: "center" }}>
                <Text>Débit</Text>
              </View>
              <View style={{ width: "10%", alignItems: "center" }}>
                <Text>Crédit</Text>
              </View>
              <View style={{ width: "10%", alignItems: "center" }}>
                <Text>Balance</Text>
              </View>
            </View>
          </View>
          {transactions.map((transaction, index) => {
            balance += transaction.amount;
            const isNewMonth =
              month !== getMonth(transaction.transactionDate) && index !== 0;
            month = getMonth(transaction.transactionDate);
            const content = isNewMonth ? (
              <View
                style={{
                  flexDirection: "row",
                  fontFamily: "RobotoMono",
                  fontWeight: "bold",

                  fontSize: 8,
                }}
              >
                <View
                  style={{
                    width: "40%",
                  }}
                ></View>
                <View
                  style={{
                    width: "50%",
                    paddingVertical: 2,
                    backgroundColor: "#f0f0f0",
                    flexDirection: "row",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  <View style={{ width: "60%" }}>
                    <Text>Total pour periode</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text>{balance < 0 && balance}</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text>{balance >= 0 && balance}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <></>
            );

            return (
              <>
                {content}
                <View
                  key={`transaction-${index}`}
                  style={{
                    flexDirection: "row",
                    fontSize: 8,
                    fontFamily: "RobotoMono",
                    //letterSpacing: 0.01,
                  }}
                >
                  <View
                    key={index}
                    style={{ flexDirection: "row", width: "10%" }}
                  >
                    <Text>
                      {transaction.transactionDate.toLocaleDateString("fr", {
                        month: "numeric",
                        day: "2-digit",
                        year: "2-digit",
                      })}
                    </Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>{transaction.transactionRef.slice(0, 10)}</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text>
                      {transaction.id.slice(0, 4)} / {transaction.classroom}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      paddingVertical: 2,
                      justifyContent: "center",
                    }}
                  >
                    <Text>{transaction.description}</Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>
                      {transaction.type == "DEBIT" ? transaction.amount : ""}
                    </Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>
                      {transaction.type == "CREDIT" ? transaction.amount : ""}
                    </Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>{balance}</Text>
                  </View>
                </View>
              </>
            );
          })}
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              {/* <QRCode data={qrCode} /> */}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default AcccountStatement;
