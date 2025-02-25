import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function TransactionConfirmationEmail({
  studentName = "Doe John",
  parentEmail = "example@gmail.com",
  paymentAmount = 50000,
  remainingBalance = 100000,
  paymentRecorder = "Dupont Pierre",
  paymentStatus = "Success",
}: {
  studentName: string;
  parentEmail: string;
  paymentAmount: number;
  remainingBalance: number;
  paymentRecorder: string;
  paymentStatus: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Confirmation de paiement des frais scolaires</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
          color: "#333",
        }}
      >
        <Container
          style={{
            padding: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "5px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Heading style={{ textAlign: "center", color: "#0073e6" }}>
            Confirmation de Paiement
          </Heading>

          <Section>
            <Text style={{ fontSize: "16px", margin: "10px 0" }}>
              Cher parent,
            </Text>
            <Text style={{ fontSize: "16px", margin: "10px 0" }}>
              Nous avons bien reçu le paiement pour les frais scolaires de votre
              enfant <strong>{studentName}</strong>.
            </Text>

            <Section>
              <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
                Détails du paiement :
              </Text>
              <Text style={{ fontSize: "14px", margin: "5px 0" }}>
                Montant payé : <strong>{paymentAmount} CFA</strong>
              </Text>
              <Text style={{ fontSize: "14px", margin: "5px 0" }}>
                Montant restant : <strong>{remainingBalance} CFA</strong>
              </Text>
              <Text style={{ fontSize: "14px", margin: "5px 0" }}>
                Parent notifié : <strong>{parentEmail}</strong>
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

            <Text style={{ fontSize: "16px", marginTop: "20px" }}>
              Merci de votre confiance et de votre engagement envers l'éducation
              de votre enfant.
            </Text>
            <Text style={{ fontSize: "16px", margin: "10px 0" }}>
              Cordialement,
              <br />
              L'équipe de gestion scolaire
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default TransactionConfirmationEmail;
