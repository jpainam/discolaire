import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const TransactionConfirmation = ({
  name,
  amount,
  remainding,
  createdBy,
}: {
  name: string;
  amount: number;
  createdBy: string;
  remainding: number;
}) => {
  return (
    <Html>
      <Head />
      <Preview>Confirmation de paiement des frais scolaires</Preview>
      <Tailwind>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto my-0 max-w-[600px] rounded-[8px] bg-white p-[24px]">
            <Heading className="m-0 mb-[16px] text-[24px] font-bold text-gray-800">
              Confirmation de Paiement
            </Heading>

            <Text className="mb-[24px] text-[16px] text-gray-700">
              Madame/Monsieur,
            </Text>

            <Text className="mb-[24px] text-[16px] text-gray-700">
              Nous avons bien reçu le paiement pour les frais scolaires de{" "}
              <span className="font-bold">{name}</span>.
            </Text>

            <Section className="mb-[24px] rounded-[8px] bg-gray-50 p-[24px]">
              <Heading className="m-0 mb-[16px] text-[18px] font-bold text-gray-800">
                Détails du paiement
              </Heading>

              <div className="mb-[12px]">
                <Text className="m-0 text-[14px] text-gray-500">
                  Montant payé
                </Text>
                <Text className="m-0 text-[16px] font-bold text-gray-800">
                  {amount.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "CFA",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </Text>
              </div>

              <div className="mb-[12px]">
                <Text className="m-0 text-[14px] text-gray-500">
                  Montant restant
                </Text>
                <Text className="m-0 text-[16px] font-bold text-gray-800">
                  {remainding.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "CFA",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </Text>
              </div>

              <div className="mb-[12px]">
                <Text className="m-0 text-[14px] text-gray-500">
                  Enregistré par
                </Text>
                <Text className="m-0 text-[16px] text-gray-800">
                  {createdBy}
                </Text>
              </div>

              <div>
                <Text className="m-0 text-[14px] text-gray-500">
                  Statut du paiement
                </Text>
                <Text className="m-0 text-[16px] font-bold text-green-600">
                  Success
                </Text>
              </div>
            </Section>

            <Text className="mb-[24px] text-[16px] text-gray-700">
              Merci de votre confiance et de votre engagement.
            </Text>

            <Button
              href="https://demo.discolaire.com"
              className="box-border block rounded-[4px] bg-blue-600 px-[20px] py-[12px] text-center text-[16px] font-medium text-white no-underline"
            >
              Voir votre compte
            </Button>

            <Hr className="my-[32px] border-t border-gray-300" />

            <Text className="m-0 text-[14px] text-gray-500">
              Si vous avez des questions concernant ce paiement, veuillez
              contacter notre service administratif.
            </Text>

            <Hr className="my-[32px] border-t border-gray-300" />

            <Text className="m-0 text-[12px] text-gray-500">
              © 2025 Discolaire. Tous droits réservés.
            </Text>
            <Text className="m-0 text-[12px] text-gray-500">
              123 Rue de l'Éducation, New York, USA
            </Text>
            <Text className="m-0 text-[12px] text-gray-500">
              <a
                href="https://demo.discolaire.com/unsubscribe?type=transaction"
                className="text-blue-600 no-underline"
              >
                Se désabonner
              </a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

TransactionConfirmation.PreviewProps = {
  name: "Jean-Paul Ainam",
  amount: 5000,
  remainding: 2000,
  createdBy: "Jean-Paul Ainam",
};
export default TransactionConfirmation;
