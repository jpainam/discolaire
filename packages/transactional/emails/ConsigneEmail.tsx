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
  date: Date;
  motif: string;
  studentName: string;
  school: School;
}

export const ConsigneEmail = ({
  title = "Notification de consigne de votre enfant",
  school = defaultSchool,
  date = new Date(),
  motif = "comportement inapproprié",
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
              Nous vous informons que votre enfant, {studentName}, a été placé
              en consigne le {date.toLocaleDateString()} en raison de :
            </Text>
            <Text className="text-center text-[14px] leading-[24px] text-[#121212]">
              <b>{motif}</b>
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Cette mesure vise à encourager un comportement plus responsable et
              un meilleur respect des règles de l&apos;école. Nous vous invitons
              à discuter avec votre enfant pour éviter que cette situation ne se
              reproduise à l&apos;avenir.
              <br />
              Pour toute question ou précision, n&apos;hésitez pas à nous
              contacter.
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

export default ConsigneEmail;
