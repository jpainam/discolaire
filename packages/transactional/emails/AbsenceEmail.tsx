import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

import { EmailFooter } from "../components/EmailFooter";
import { EmailHeader } from "../components/EmailHeader";

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
  title: string;
  studentName: string;
  date: Date;
  school: School;
}

export const AbsenceEmail = ({
  title = "Absence de Dupont Pierre",
  date = new Date(),
  school = defaultSchool,
  studentName = "Dupont Pierre",
}: Props) => {
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
        <Preview>{title}</Preview>
        <Body className="mx-auto my-auto bg-[#f5f5f5] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[8px] border border-[#E8E7E1] bg-white p-[32px]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <EmailHeader logoUrl={school.logo} schoolName={school.name} />
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Madame/Monsieur,
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Nous vous informons que votre enfant, {studentName}, est absent(e)
              aujourd&apos;hui, {date.toLocaleDateString()}. Merci de bien
              vouloir nous tenir informé de la raison de cette absence.
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Cordialement,
              <br />
              La direction
              <br />
              {school.name}
            </Text>
            <EmailFooter schoolName={school.name} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AbsenceEmail;
