import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { EmailFooter } from "../components/EmailFooter";
import { EmailHeader } from "../components/EmailHeader";

interface ChangeEmailVerificationEmailProps {
  username?: string;
  newEmail?: string;
  verificationLink?: string;
  schoolName?: string;
  logo?: string;
}

const ChangeEmailVerificationEmail = ({
  username = "Jean Dupont",
  newEmail = "nouveau@exemple.com",
  verificationLink = "https://discolaire.com/verify-email-change",
  schoolName = "Mon École",
  logo = "",
}: ChangeEmailVerificationEmailProps) => {
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
        <Preview>Confirmez le changement de votre adresse e-mail</Preview>
        <Body className="mx-auto my-auto bg-[#f5f5f5] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[8px] border border-[#E8E7E1] bg-white p-[32px]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <EmailHeader logoUrl={logo} schoolName={schoolName} />
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Bonjour {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Vous avez demandé à changer votre adresse e-mail vers{" "}
              <strong>{newEmail}</strong>. Cliquez sur le bouton ci-dessous pour
              confirmer ce changement.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                href={verificationLink}
                className="box-border rounded-[8px] bg-[#007bff] px-[20px] py-[12px] text-[16px] font-medium text-white no-underline"
              >
                Confirmer le changement
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-[#333]">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans
              votre navigateur :
            </Text>
            <Link
              href={verificationLink}
              className="text-[12px] text-[#007bff] underline"
              style={{ wordBreak: "break-all" }}
            >
              {verificationLink}
            </Link>
            <Hr className="my-[32px] border-[#e6e6e6]" />
            <Text className="text-[14px] text-[#666666]">
              Si vous n&apos;avez pas demandé ce changement, vous pouvez ignorer
              cet e-mail. Votre adresse e-mail actuelle restera inchangée.
            </Text>
            <EmailFooter schoolName={schoolName} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ChangeEmailVerificationEmail.PreviewProps = {
  username: "Jean Dupont",
  newEmail: "nouveau@exemple.com",
  verificationLink: "https://discolaire.com/verify-email-change/abc123",
  schoolName: "Mon École",
};

export default ChangeEmailVerificationEmail;
