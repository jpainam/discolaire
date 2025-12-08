import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { format } from "date-fns";

import { Footer } from "../components/footer";
import { Head } from "../components/Head";
import { Logo } from "../components/logo";
import { env } from "../env";
import { geti18n } from "../locales";
import { cn } from "../utils";

interface Transaction {
  id: number;
  date: string;
  amount: number;
  name: string;
  deleted: boolean;
  description: string;
  currency: string;
  category?: string;
  status: string;
}

interface School {
  logo: string;
  name: string;
  id: string;
}

const defaultSchool = {
  logo: `logo-round.png`,
  name: "Institut Polyvalent Wague",
  id: "1",
};

interface Props {
  fullName: string;
  transactions: Transaction[];
  locale: string;
  school: School;
}

const defaultTransactions = [
  {
    id: 1,
    date: new Date().toISOString(),
    amount: -1000,
    deleted: true,
    currency: "CFA",
    name: "Spotify",
    description: "Spotify Premium",
    status: "PENDING",
  },
  {
    id: 2,
    date: new Date().toISOString(),
    amount: 1000,
    currency: "CFA",
    description: "Salary",
    name: "H23504959",
    category: "income",
    deleted: false,
    status: "PENDING",
  },
  {
    id: 3,
    date: new Date().toISOString(),
    amount: -1000,
    deleted: false,
    currency: "CFA",
    description: "Webflow Subscription",
    name: "Webflow",
    status: "PENDING",
  },
  {
    id: 4,
    date: new Date().toISOString(),
    amount: -1000,
    currency: "CFA",
    deleted: true,
    description: "Netflix Subscription",
    name: "Netflix",
    status: "VALIDATED",
  },
];

export const TransactionsSummary = ({
  fullName = "Jean-Paul Ainam",
  transactions = defaultTransactions,
  locale = "fr",
  school = defaultSchool,
}: Props) => {
  const { t } = geti18n({ locale });
  const firstName = fullName.split(" ").at(0) ?? "";

  const previewText = t("transactions.preview", {
    firstName,
    numberOfTransactions: transactions.length,
  });

  const today = new Date();

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{previewText}</Preview>

        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo logoUrl={school.logo} />
            <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
              {t("transactions.title1")}
              <span className="font-semibold">
                {t("transactions.title2", {
                  count: transactions.length,
                })}{" "}
              </span>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              {t("transactions.title3", { firstName })},
              <br />
              <br />
              {t("transactions.description", {
                date: format(today, "MMMM d, yyyy"),
                schoolName: school.name,
              })}{" "}
            </Text>

            <br />

            <table
              style={{ width: "100% !important", minWidth: "100%" }}
              className="w-full border-collapse"
            >
              <thead style={{ width: "100%" }}>
                <tr className="h-[45px] border-0 border-t-[1px] border-b-[1px] border-solid border-[#E8E7E1]">
                  <th align="left">
                    <Text className="m-0 p-0 text-[14px] font-semibold">
                      {t("date")}
                    </Text>
                  </th>
                  <th align="left" style={{ width: "50%" }}>
                    <Text className="m-0 p-0 text-[14px] font-semibold">
                      {t("description")}
                    </Text>
                  </th>
                  <th align="left">
                    <Text className="m-0 p-0 text-[14px] font-semibold">
                      {t("amount")}
                    </Text>
                  </th>
                </tr>
              </thead>

              <tbody style={{ width: "100%", minWidth: "100% !important" }}>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="h-[45px] border-0 border-b-[1px] border-solid border-[#E8E7E1]"
                  >
                    <td align="left">
                      <Text className="m-0 mt-1 p-0 pb-1 text-xs">
                        {format(new Date(transaction.date), "MMM d")}
                      </Text>
                    </td>
                    <td align="left" style={{ width: "50%" }}>
                      <Link
                        href={`${env.NEXT_PUBLIC_BASE_URL}/transactions?id=${transaction.id}`}
                        className={cn(
                          "text-[#121212]",
                          transaction.category === "income" &&
                            "!text-[#00C969]",
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <Text className="line-clamp-1 text-xs">
                            {transaction.name}
                          </Text>

                          <div className="flex items-center space-x-1 border px-2 py-1 text-xs text-[#878787]">
                            {transaction.deleted ? (
                              <span className="rounded-md bg-red-300 px-2 text-red-950">
                                {t("deleted")}
                              </span>
                            ) : (
                              <span>
                                {t(
                                  transaction.status as
                                    | "PENDING"
                                    | "CANCELED"
                                    | "VALIDATED",
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td align="left">
                      <Text
                        className={cn(
                          "m-0 mt-1 p-0 pb-1 text-xs text-[#121212]",
                          transaction.category === "income" &&
                            "!text-[#00C969]",
                        )}
                      >
                        {Intl.NumberFormat(locale, {
                          style: "currency",
                          currency: transaction.currency,
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        }).format(transaction.amount)}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <br />

            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                style={{
                  ...button,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                }}
                href={`${env.NEXT_PUBLIC_BASE_URL}/transactions?start=${transactions.at(0)?.date}&end=${transactions[transactions.length - 1]?.date}`}
              >
                {t("transactions.view")}
              </Button>
            </Section>

            <br />
            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const button = {
  backgroundColor: "#007bff",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

export default TransactionsSummary;
