import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { LineItems } from "./LineItems";

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

export interface Template {
  logo_url?: string;
  from_label: string;
  customer_label: string;
  invoice_no_label: string;
  issue_date_label: string;
  due_date_label: string;
  date_format: string;
  payment_label: string;
  note_label: string;
  description_label: string;
  quantity_label: string;
  price_label: string;
  total_label: string;
  tax_label: string;
  vat_label: string;
}

export interface LineItem {
  name: string;
  quantity: number;
  price: number;
  invoice_number?: string;
  issue_date?: string;
  due_date?: string;
}

interface Props {
  student: NonNullable<RouterOutputs["student"]["get"]>;
  transactions: RouterOutputs["studentAccount"]["getStatements"];
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
  size?: "letter" | "a4";
}

export async function AcccountStatement({
  student,
  school,
  transactions,
  size = "letter",
}: Props) {
  // const qrCode = await QRCodeUtil.toDataURL(
  //   "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  //   {
  //     width: 40 * 3,
  //     height: 40 * 3,
  //     margin: 0,
  //   },
  // );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <Document>
      <Page
        size={size.toUpperCase() as "LETTER" | "A4"}
        style={{
          padding: 20,
          backgroundColor: "#fff",
          fontFamily: "GeistMono",
          color: "#000",
        }}
      >
        <View style={{ marginBottom: 20 }}>
          {school.logo && (
            <Image
              src={school.logo}
              style={{
                width: 78,
                height: 78,
              }}
            />
          )}
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 9, fontWeight: 500 }}>
                {student.lastName}
              </Text>
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 9, fontWeight: 500 }}>
                {student.firstName}
              </Text>
            </View>
          </View>
        </View>

        <LineItems
          lineItems={transactions}
          currency={"CFA"}
          descriptionLabel={"Description"}
          quantityLabel={"Reference"}
          priceLabel={"Debit"}
          totalLabel={"Credit"}
        />

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
