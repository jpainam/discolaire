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
  school: School;
}

export const ChatterEmail = ({
  title = "Rappel concernant le bavardage en classe",
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
              Nous souhaitons vous informer que, {studentName}, a été rappelé(e)
              à l&apos;ordre en raison de bavardages fréquents en classe; ce qui
              perturbe le déroulement des cours. Nous vous prions de bien
              vouloir en discuter avec lui/elle pour éviter toute récidive.
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

export default ChatterEmail;
