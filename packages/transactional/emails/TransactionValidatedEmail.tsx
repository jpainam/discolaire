import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Head } from "../components/Head";
import { Logo } from "../components/logo";

interface School {
  logo?: string | null;
  name: string;
  id: string;
}

const defaultSchool = {
  logo: `logo-round.png`,
  name: "Institut Polyvalent Wague",
  id: "1",
};

interface Props {
  studentName: string;
  amount: number;
  transactionRef: string;
  school: School;
  transactionsUrl: string;
}

export const TransactionValidatedEmail = ({
  studentName = "Dupont Pierre",
  amount = 50000,
  transactionRef = "CR00012345",
  school = defaultSchool,
  transactionsUrl = "https://demo.discolaire.com/students/1/transactions",
}: Props) => {
  const formattedAmount = amount.toLocaleString("fr-FR", {
    style: "currency",
    currency: "CFA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Paiement validé - montant reflété dans votre compte</Preview>

        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo logoUrl={school.logo} />
            <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
              Madame / Monsieur
            </Heading>

            <br />

            <Text className="text-[#121212]">
              Nous avons le plaisir de vous informer que votre paiement de{" "}
              <span className="font-semibold">{formattedAmount}</span> pour{" "}
              <span className="font-semibold">{studentName}</span> (référence :{" "}
              <span className="font-semibold">{transactionRef}</span>) a été{" "}
              <span className="font-semibold">
                entièrement traité et validé
              </span>
              .
            </Text>

            <Text className="text-[#121212]">
              Le montant est désormais reflété dans le compte de votre
              apprenant. Vous pouvez consulter le détail de vos transactions en
              cliquant sur le bouton ci-dessous.
            </Text>

            <Section className="mt-[24px] mb-[24px] text-center">
              <Button
                href={transactionsUrl}
                className="box-border rounded-[4px] bg-blue-600 px-[20px] py-[12px] text-center text-[14px] font-medium text-white no-underline"
              >
                Voir mes transactions
              </Button>
            </Section>

            <Text className="text-[#121212]">
              Cordialement,
              <br />
              La direction
              <br />
              {school.name}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TransactionValidatedEmail;
