import {
  Body,
  Button,
  Column,
  Container,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Head } from "../components/Head";
import { Logo } from "../components/logo";

export interface TransactionItem {
  date: string; // pre-formatted, e.g. "25/02"
  studentName: string;
  description: string | null;
  amount: number;
  method: string;
  status: "PENDING" | "VALIDATED" | "CANCELED";
  transactionType: "CREDIT" | "DEBIT" | "DISCOUNT";
}

export interface TransactionsSummaryProps {
  school: { name: string; logo?: string | null };
  periodLabel: string;
  periodType: "wednesday" | "friday";
  transactions: TransactionItem[];
  totalAmount: number;
  totalValidated: number;
  totalPending: number;
  totalCanceled: number;
  transactionsUrl: string;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente",
  VALIDATED: "Validé",
  CANCELED: "Annulé",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#d97706",
  VALIDATED: "#059669",
  CANCELED: "#dc2626",
};

const METHOD_LABEL: Record<string, string> = {
  CASH: "Espèces",
  CARD: "Carte",
  TRANSFER: "Virement",
  MOBILE: "Mobile Money",
  CHECK: "Chèque",
};

function formatAmount(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

const previewTransactions: TransactionItem[] = [
  {
    date: "25/02",
    studentName: "Ainam Jean-Paul",
    description: "Frais de scolarité T1",
    amount: 50000,
    method: "CASH",
    status: "VALIDATED",
    transactionType: "CREDIT",
  },
  {
    date: "26/02",
    studentName: "Dupont Marie",
    description: "Frais d'inscription",
    amount: 15000,
    method: "TRANSFER",
    status: "PENDING",
    transactionType: "CREDIT",
  },
  {
    date: "27/02",
    studentName: "Nguema Paul",
    description: "Frais de scolarité T2",
    amount: 50000,
    method: "CASH",
    status: "CANCELED",
    transactionType: "CREDIT",
  },
];

export const TransactionsSummary = ({
  school = { name: "Institut Polyvalent Wague", logo: "logo-round.png" },
  periodLabel = "du lundi 25 février au mercredi 27 février 2026",
  periodType = "wednesday",
  transactions = previewTransactions,
  totalAmount = 115000,
  totalValidated = 50000,
  totalPending = 15000,
  totalCanceled = 50000,
  transactionsUrl = "https://demo.discolaire.com/accounting/transactions",
}: TransactionsSummaryProps) => {
  const isWeekly = periodType === "friday";
  const title = isWeekly
    ? "Bilan hebdomadaire des transactions"
    : "Bilan des 3 derniers jours";

  const intro = isWeekly
    ? `Voici le récapitulatif des transactions enregistrées cette semaine (${periodLabel}) pour l'année scolaire en cours.`
    : `Voici le récapitulatif des transactions enregistrées au cours des 3 derniers jours (${periodLabel}) pour l'année scolaire en cours.`;

  const cronNote = isWeekly
    ? "Cet e-mail est généré automatiquement chaque vendredi."
    : "Cet e-mail est généré automatiquement chaque mercredi.";

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>
          {title} — {school.name}
        </Preview>

        <Body className="mx-auto my-auto bg-[#f6f7fb] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[10px] bg-white p-[24px]"
            style={{ borderStyle: "solid", borderWidth: 1, borderColor: "#E8E7E1" }}
          >
            <Logo logoUrl={school.logo} />

            <Heading className="mx-0 mt-[16px] p-0 text-[20px] font-semibold text-[#101828]">
              {title}
            </Heading>

            <Text className="mt-[8px] mb-0 text-[14px] text-[#475467]">
              Bonjour,
            </Text>

            <Text className="mt-[4px] mb-[20px] text-[14px] text-[#475467]">
              {intro} Le détail des{" "}
              <span className="font-semibold">
                {transactions.length} transaction
                {transactions.length !== 1 ? "s" : ""}
              </span>{" "}
              est présenté ci-dessous.
            </Text>

            {/* Stats row */}
            <Section className="mb-[20px]">
              <Row>
                <Column style={{ width: "25%", paddingRight: 6 }}>
                  <div
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: 6,
                      padding: "10px 8px",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      style={{ margin: 0, fontSize: 11, color: "#6b7280", marginBottom: 4 }}
                    >
                      Total encaissé
                    </Text>
                    <Text
                      style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827" }}
                    >
                      {formatAmount(totalAmount)}
                    </Text>
                  </div>
                </Column>
                <Column style={{ width: "25%", paddingRight: 6 }}>
                  <div
                    style={{
                      background: "#ecfdf5",
                      border: "1px solid #6ee7b7",
                      borderRadius: 6,
                      padding: "10px 8px",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      style={{ margin: 0, fontSize: 11, color: "#059669", marginBottom: 4 }}
                    >
                      Validé
                    </Text>
                    <Text
                      style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#065f46" }}
                    >
                      {formatAmount(totalValidated)}
                    </Text>
                  </div>
                </Column>
                <Column style={{ width: "25%", paddingRight: 6 }}>
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1px solid #fcd34d",
                      borderRadius: 6,
                      padding: "10px 8px",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      style={{ margin: 0, fontSize: 11, color: "#d97706", marginBottom: 4 }}
                    >
                      En attente
                    </Text>
                    <Text
                      style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#92400e" }}
                    >
                      {formatAmount(totalPending)}
                    </Text>
                  </div>
                </Column>
                <Column style={{ width: "25%" }}>
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fca5a5",
                      borderRadius: 6,
                      padding: "10px 8px",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      style={{ margin: 0, fontSize: 11, color: "#dc2626", marginBottom: 4 }}
                    >
                      Annulé
                    </Text>
                    <Text
                      style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#7f1d1d" }}
                    >
                      {formatAmount(totalCanceled)}
                    </Text>
                  </div>
                </Column>
              </Row>
            </Section>

            {/* Transaction table */}
            {transactions.length === 0 ? (
              <Section
                style={{
                  border: "1px solid #E8E7E1",
                  borderRadius: 6,
                  padding: "20px",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                <Text style={{ margin: 0, fontSize: 14, color: "#98a2b3" }}>
                  Aucune transaction enregistrée sur cette période.
                </Text>
              </Section>
            ) : (
              <Section
                style={{
                  border: "1px solid #E8E7E1",
                  borderRadius: 6,
                  marginBottom: 20,
                  overflow: "hidden",
                }}
              >
                {/* Table header */}
                <Row
                  style={{
                    background: "#f9fafb",
                    borderBottom: "1px solid #E8E7E1",
                    padding: "8px 12px",
                  }}
                >
                  <Column style={{ width: "12%" }}>
                    <Text
                      style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#374151" }}
                    >
                      Date
                    </Text>
                  </Column>
                  <Column style={{ width: "28%" }}>
                    <Text
                      style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#374151" }}
                    >
                      Élève
                    </Text>
                  </Column>
                  <Column style={{ width: "28%" }}>
                    <Text
                      style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#374151" }}
                    >
                      Description
                    </Text>
                  </Column>
                  <Column style={{ width: "18%", textAlign: "right" }}>
                    <Text
                      style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#374151" }}
                    >
                      Montant
                    </Text>
                  </Column>
                  <Column style={{ width: "14%", textAlign: "center" }}>
                    <Text
                      style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#374151" }}
                    >
                      Statut
                    </Text>
                  </Column>
                </Row>

                {transactions.map((tx, i) => (
                  <Row
                    key={i}
                    style={{
                      borderBottom:
                        i < transactions.length - 1 ? "1px solid #f3f4f6" : "none",
                      padding: "8px 12px",
                      background: i % 2 === 0 ? "#ffffff" : "#fafafa",
                    }}
                  >
                    <Column style={{ width: "12%" }}>
                      <Text style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                        {tx.date}
                      </Text>
                    </Column>
                    <Column style={{ width: "28%" }}>
                      <Text style={{ margin: 0, fontSize: 12, color: "#111827" }}>
                        {tx.studentName}
                      </Text>
                    </Column>
                    <Column style={{ width: "28%" }}>
                      <Text style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                        {tx.description ?? METHOD_LABEL[tx.method] ?? tx.method}
                      </Text>
                    </Column>
                    <Column style={{ width: "18%", textAlign: "right" }}>
                      <Text
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 600,
                          color:
                            tx.transactionType === "DEBIT" ? "#dc2626" : "#059669",
                        }}
                      >
                        {tx.transactionType === "DEBIT" ? "−" : "+"}
                        {formatAmount(tx.amount)}
                      </Text>
                    </Column>
                    <Column style={{ width: "14%", textAlign: "center" }}>
                      <Text
                        style={{
                          margin: 0,
                          fontSize: 11,
                          fontWeight: 600,
                          color: STATUS_COLOR[tx.status] ?? "#374151",
                        }}
                      >
                        {STATUS_LABEL[tx.status] ?? tx.status}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            <Button
              href={transactionsUrl}
              style={{
                display: "block",
                background: "#2563eb",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Voir toutes les transactions
            </Button>

            <Hr className="my-[20px] border-[#eaecf0]" />

            <Text className="m-0 text-[13px] text-[#475467]">
              Cordialement,
              <br />
              Le système Discolaire
              <br />
              {school.name}
            </Text>

            <Text className="mt-[16px] mb-0 text-[11px] text-[#98a2b3]">
              {cronNote} Ne pas répondre à ce message.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TransactionsSummary;
