import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { EmailFooter } from "../components/EmailFooter";

export default function PasswordResetSuccess({
  loginUrl = "https://app.discolaire.com/login",
}: {
  loginUrl?: string;
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
        <Preview>Votre mot de passe a été réinitialisé</Preview>
        <Body className="mx-auto my-auto bg-[#f5f5f5] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[8px] border border-[#E8E7E1] bg-white p-[32px]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Text className="mb-[4px] text-[24px] font-semibold text-blue-600">
              Mot de passe réinitialisé
            </Text>
            <Text className="mb-[16px] text-[14px] leading-[24px] text-gray-700">
              Bonjour,
            </Text>
            <Text className="mb-[24px] text-[14px] leading-[24px] text-gray-700">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez
              maintenant vous connecter avec votre nouveau mot de passe.
            </Text>
            <Section className="text-center">
              <Button
                href={loginUrl}
                className="box-border rounded-[8px] bg-blue-600 px-[24px] py-[12px] text-[16px] font-medium text-white no-underline"
              >
                Se connecter
              </Button>
            </Section>
            <Text className="mt-[24px] text-[12px] text-gray-500">
              Si vous n&apos;avez pas demandé cette modification, veuillez
              contacter notre équipe d&apos;assistance immédiatement.
            </Text>
            <EmailFooter />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
