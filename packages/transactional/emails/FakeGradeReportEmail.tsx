import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

import { EmailFooter } from "../components/EmailFooter";

export function FakeGradeReportEmail({
  studentName,
  reportedBy,
  gradeDetails,
  reportComment,
}: {
  studentName: string;
  reportedBy: string;
  gradeDetails: {
    grade: string;
    subject: string;
    date: string;
  };
  reportComment?: string;
}) {
  return (
    <Html lang="fr">
      <Tailwind>
        <Head>
          <Font
            fontFamily="Geist"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Geist"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
              format: "woff2",
            }}
            fontWeight={500}
            fontStyle="normal"
          />
        </Head>
        <Preview>Signalement de fausse note</Preview>
        <Body className="mx-auto my-auto bg-[#f5f5f5] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[8px] border border-[#E8E7E1] bg-white p-[32px]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Heading className="mb-[16px] text-[22px] font-semibold text-gray-800">
              Signalement de fausse note
            </Heading>
            <Text className="mb-[16px] text-[14px] leading-[24px] text-gray-700">
              Bonjour Administrateur,
            </Text>
            <Text className="mb-[16px] text-[14px] leading-[24px] text-gray-700">
              Une fausse note a été signalée dans le système de gestion scolaire
              par <strong>{reportedBy}</strong>.
            </Text>
            <Text className="mb-[16px] text-[14px] leading-[24px] text-gray-700">
              <strong>Détails de l&apos;élève :</strong>
              <br />
              Nom : {studentName}
              <br />
              Note : {gradeDetails.grade}
              <br />
              Matière : {gradeDetails.subject}
              <br />
              Date : {gradeDetails.date}
            </Text>
            <Text className="mb-[24px] text-[14px] leading-[24px] text-gray-700">
              <strong>Commentaire du rapport :</strong>
              <br />
              {reportComment ?? "Aucun commentaire"}
            </Text>
            <Button
              href="https://votre-systeme-gestion.com/gestion-grades"
              className="rounded bg-blue-500 px-[16px] py-[8px] text-[14px] text-white no-underline"
            >
              Voir la note signalée
            </Button>
            <Text className="mt-[24px] text-[12px] text-gray-500">
              Cet email est généré automatiquement. Veuillez ne pas répondre.
            </Text>
            <EmailFooter />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
