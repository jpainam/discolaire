/* eslint-disable @next/next/no-img-element */
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { useLocale } from "@repo/hooks/use-locale";
import { numberToWords } from "@repo/lib/toword";
import FlatBadge from "@repo/ui/FlatBadge";
import { Separator } from "@repo/ui/separator";

import { CURRENCY } from "~/lib/constants";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export interface PdfReceiptProps {
  address?: string;
  name?: string;
  phoneNumber1?: string;
  studentName?: string;
  transactionRef?: string;
  description?: string;
  contactPrefix?: string;
  amount: number;
  remaining: number;
  contactPhoneNumber?: string;
  classroomName: string;
  receivedBy: string;
  printedAt?: string;
  receivedAt: string;
  printedBy: string;
  receivedByPrefix: string;
  printedByPrefix: string;
  createdAt: string;
  createdBy: string;
  contactName?: string;
  createdByPrefix: string;
}
export function PdfReceipt(props: PdfReceiptProps) {
  const { t, i18n } = useLocale();
  console.log("PdfReceipt", props);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            position: "relative",
            margin: "0 auto",
            overflow: "hidden",
            borderRadius: 8,
            borderWidth: 1,
            padding: 16,
            width: "50%",
          }}
        >
          {/* Watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
            <img
              src="/images/logo.png?height=350&width=350"
              alt="Watermark"
              width={350}
              height={350}
              className="object-contain"
            />
          </div>

          {/* Receipt content */}
          <div className="relative z-10">
            {/* <h1 className="mb-4 text-2xl font-bold text-red-700">Reçu de caisse</h1> */}

            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <img
                  src="/images/logo.png?height=100&width=100"
                  alt="Institut Logo"
                  width={200}
                  height={500}
                />
              </div>
              <div className="text-right">
                <p className="font-bold">{props.name}</p>
                <Text>{props.address}</Text>
                <p>
                  {t("phoneNumber")} : {props.phoneNumber1}
                </p>
                <Text>************</Text>
              </div>
            </div>

            <div className="mb-2 text-center">
              <h2 className="text-xl font-bold">{props.studentName}</h2>
              <p className="text-lg font-bold">{props.transactionRef}</p>
            </div>
            <Separator className="mb-2" />
            <div className="mb-2 flex justify-between">
              <div>
                <p>
                  <span className="font-bold uppercase">{t("for")}</span> :{" "}
                  {props.description}
                </p>
                <p>
                  <span className="font-bold uppercase">{t("amount")}</span> :
                  {props.amount.toLocaleString(i18n.language, {
                    style: "currency",
                    currency: CURRENCY,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}{" "}
                  ({numberToWords(props.amount, i18n.language)} )
                </p>
                <p>
                  <span className="font-bold uppercase">{t("remaining")}</span>{" "}
                  :{" "}
                  {props.remaining.toLocaleString(i18n.language, {
                    style: "currency",
                    currency: CURRENCY,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">
                  {t("classroom")} : {props.classroomName}
                </p>
                <FlatBadge
                  variant={"gray"}
                  className="rounded-lg border px-2 text-lg font-bold"
                >
                  {t("amount")} : #{props.amount}#
                </FlatBadge>
              </div>
            </div>

            <div className="mb-2 flex justify-between text-sm">
              <div>
                <Text>
                  S/C {props.contactPrefix} {props.contactName}
                </Text>
                <Text>
                  {t("phone")}: {props.contactPhoneNumber}
                </Text>
              </div>
              <div className="text-right">
                <Text>
                  {t("recorded_by")} {props.createdByPrefix} {props.createdBy}
                </Text>
                <Text>{props.createdAt}</Text>
              </div>
            </div>

            <div className="flex justify-between gap-2 text-sm">
              <div className="flex flex-col">
                <Text>
                  {t("printed_by")} {props.printedByPrefix} {props.printedBy}{" "}
                </Text>
                <Text>{props.printedAt}</Text>
              </div>
              <View
                style={{
                  flexDirection: "column",
                  display: "flex",
                }}
              >
                <Text>
                  {t("received_by")} {props.receivedByPrefix} {props.receivedBy}
                </Text>
                <Text>{props.receivedAt}</Text>
              </View>
            </div>
          </div>
        </View>
      </Page>
    </Document>
  );
}
