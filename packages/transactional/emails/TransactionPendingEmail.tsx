import {
  Body,
  Container,
  Heading,
  Html,
  Preview,
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
}

export const TransactionPendingEmail = ({
  studentName = "Dupont Pierre",
  amount = 50000,
  transactionRef = "CR00012345",
  school = defaultSchool,
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
        <Preview>Paiement reçu - en cours de traitement</Preview>

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
              Nous avons bien reçu votre paiement de{" "}
              <span className="font-semibold">{formattedAmount}</span> pour{" "}
              <span className="font-semibold">{studentName}</span> (référence :{" "}
              <span className="font-semibold">{transactionRef}</span>).
            </Text>

            <Text className="text-[#121212]">
              Votre paiement est actuellement{" "}
              <span className="font-semibold">en cours de traitement</span>. Il
              sera validé et reflété dans votre compte dans les plus brefs
              délais.
            </Text>

            <Text className="text-[#121212]">
              Vous recevrez une confirmation dès que votre paiement sera
              entièrement traité.
            </Text>

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

export default TransactionPendingEmail;
