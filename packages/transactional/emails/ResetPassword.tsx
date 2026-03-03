import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Html,
  Link,
  Preview,
  Section,
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

export const ResetPassword = ({
  username = "Dupont",
  resetLink = "https://example.com/reset-password",
  school = defaultSchool,
}: {
  username: string;
  resetLink: string;
  school: School;
}) => {
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
        <Preview>Réinitialiser le mot de passe</Preview>
        <Body className="mx-auto my-auto bg-[#f5f5f5] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[8px] border border-[#E8E7E1] bg-white p-[32px]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <EmailHeader logoUrl={school.logo} schoolName={school.name} />
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Bonjour {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur
              le lien ci-dessous pour choisir un nouveau mot de passe.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="box-border rounded-[8px] bg-[#007bff] px-[20px] py-[12px] text-[16px] font-medium text-white no-underline"
                href={resetLink}
              >
                Réinitialiser le mot de passe
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-[#333]">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans
              votre navigateur :
            </Text>
            <Link
              href={resetLink}
              className="text-[12px] text-[#007bff] underline"
              style={{ wordBreak: "break-all" }}
            >
              {resetLink}
            </Link>
            <EmailFooter schoolName={school.name} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPassword;
