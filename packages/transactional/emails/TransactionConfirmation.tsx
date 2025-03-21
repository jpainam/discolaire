import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Logo } from "../components/logo";
import { getAssetUrl } from "../utils";

interface School {
  logo?: string | null;
  name: string;
  id: string;
}

const assetUrl = getAssetUrl();
const defaultSchool = {
  logo: `${assetUrl}/images/logo-round.png`,
  name: "Institut Polyvalent Wague",
  id: "1",
};

export function TransactionConfirmation({
  studentName = "Doe John",
  paymentAmount = 50000,
  school = defaultSchool,
  remainingBalance = 100000,
  paymentRecorder = "Dupont Pierre",
  paymentStatus = "Success",
  title = "Confirmation de paiement scolaire",
}: {
  studentName: string;
  school: School;
  paymentAmount: number;
  remainingBalance: number;
  paymentRecorder: string;
  paymentStatus: string;
  title: string;
}) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{title}</Preview>

        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo logoUrl={school.logo ?? defaultSchool.logo} />

            <br />
            <span className="font-medium">Madame/Monsieur</span>
            <Text className="text-[#121212]">
              Nous avons bien reçu le paiement pour les frais scolaires de{" "}
              <strong>{studentName}</strong>.
            </Text>

            <Section>
              <Text style={{ fontWeight: "bold" }}>Détails du paiement :</Text>
              <Text style={{ margin: "5px 0" }}>
                Montant payé : <strong>{paymentAmount} CFA</strong>
              </Text>
              <Text style={{ margin: "5px 0" }}>
                Montant restant : <strong>{remainingBalance} CFA</strong>
              </Text>
              <Text style={{ fontSize: "14px", margin: "5px 0" }}>
                Enregistré par : <strong>{paymentRecorder}</strong>
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  margin: "5px 0",
                  color: "green",
                }}
              >
                Statut du paiement : <strong>{paymentStatus}</strong>
              </Text>
            </Section>

            <Text style={{ marginTop: "20px" }}>
              Merci de votre confiance et de votre engagement.
            </Text>
            <Text style={{ margin: "10px 0" }}>
              L'équipe de gestion scolaire
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default TransactionConfirmation;
