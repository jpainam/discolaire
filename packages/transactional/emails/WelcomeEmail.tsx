import {
  Body,
  Button,
  Column,
  Container,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  fullName?: string;
  url?: string;
  logo: string;
}

const WelcomeEmail = ({
  fullName = "Jean-Paul Ainam",
  url = "fr",
  logo = `logo-round.png`,
}: WelcomeEmailProps) => {
  const t = (key: string) => {
    const translations: Record<string, string> = {
      welcome_text1:
        "Bienvenue sur Discolaire ! Nous sommes ravis de vous accueillir.",
      welcome_to_discolaire: "Bienvenue sur Discolaire",
      welcome_title1:
        "Voici ce que vous pouvez faire avec votre nouveau compte :",
      welcome_text2: "Gérer les inscriptions et les élèves facilement.",
      welcome_text3: "Suivre les notes, présences, et justificatifs.",
      welcome_text4: "Centraliser les communications avec les parents.",
      welcome_text5: "Organiser et visualiser vos événements scolaires.",
      welcome_text6:
        "Notre mission est de vous accompagner au quotidien pour améliorer la qualité de l'administration scolaire et vous faire gagner du temps.",
      welcome_text7: "Prêt à commencer ?",
      welcome_text8:
        "Cliquez sur le bouton ci-dessous pour accéder à votre compte et commencer à explorer.",
      welcome_text9: "Merci de rejoindre notre communauté !",
      get_started: "Commencez dès maintenant",
    };
    return translations[key] ?? key;
  };

  // Simulating asset and base URLs

  const baseUrl = "https://discolaire.com";

  return (
    <Html>
      <Tailwind>
        <Preview>{t("welcome_text1")}</Preview>

        <Body className="bg-[#f5f5f5] py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
            {/* Logo Section */}
            <Section className="mb-[24px] text-center">
              <Img
                src={logo}
                alt="Discolaire Logo"
                width="80"
                height="80"
                className="mx-auto h-auto w-[80px] object-cover"
              />
            </Section>

            {/* Header */}
            <Heading className="mt-[16px] mb-[24px] text-center text-[24px] font-bold text-gray-600">
              {t("welcome_to_discolaire")}
            </Heading>

            {/* Personalized Greeting */}
            <Text className="mb-[16px] text-[16px] text-gray-600">
              <span className="font-bold">Hi {fullName},</span>
            </Text>

            {/* Introduction */}
            <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-600">
              {t("welcome_text1")}
            </Text>

            {/* Features Section */}
            <Section className="mb-[24px] rounded-[8px] bg-[#f9f9f9] p-[16px]">
              <Text className="mb-[12px] text-[18px] font-medium text-gray-600">
                {t("welcome_title1")}
              </Text>
              <ul className="m-0 p-0 pl-[24px]">
                <li className="mb-[8px] text-[16px] text-gray-600">
                  {t("welcome_text2")}
                </li>
                <li className="mb-[8px] text-[16px] text-gray-600">
                  {t("welcome_text3")}
                </li>
                <li className="mb-[8px] text-[16px] text-gray-600">
                  {t("welcome_text4")}
                </li>
                <li className="mb-[8px] text-[16px] text-gray-600">
                  {t("welcome_text5")}
                </li>
              </ul>
            </Section>

            {/* Commitment Statement */}
            <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-600">
              {t("welcome_text6")}
            </Text>

            {/* Call to Action Section */}
            <Section className="mb-[24px]">
              <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-600">
                <span className="font-bold">{t("welcome_text7")}</span>{" "}
                {t("welcome_text8")}
              </Text>

              <Row>
                <Column align="center">
                  <Button
                    href={url}
                    className="box-border rounded-[8px] bg-[#007bff] px-[32px] py-[12px] text-[16px] font-medium text-white no-underline"
                  >
                    {t("get_started")}
                  </Button>
                </Column>
              </Row>
            </Section>

            <Hr className="my-[24px] border-[#e6e6e6]" />

            {/* Signature Section */}
            <Section className="mb-[16px]">
              <Text className="mb-[8px] text-[14px] text-[#707070]">
                {t("welcome_text9")}
              </Text>
              <Text className="mb-[8px] text-[16px] font-bold text-gray-600">
                Jean-Paul Ainam
              </Text>
              <Img
                src={`https://discolaire-images-public-uploads-g5v2c4o.s3.eu-central-1.amazonaws.com/signature.png`}
                alt="Signature"
                className="h-[24px] w-auto"
              />
            </Section>

            {/* Footer */}
            <Section className="mt-[32px] text-center text-[12px] text-[#8c8c8c]">
              <Text className="m-0">
                © {new Date().getFullYear()} Discolaire. All rights reserved.
              </Text>
              <Text className="m-0">
                123 Education Street, Learning City, 10001
              </Text>
              <Text className="m-0">
                <a
                  href={`${baseUrl}/preferences`}
                  className="text-[#8c8c8c] underline"
                >
                  Email Preferences
                </a>{" "}
                •
                <a
                  href={`${baseUrl}/unsubscribe`}
                  className="text-[#8c8c8c] underline"
                >
                  {" "}
                  Unsubscribe
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

WelcomeEmail.PreviewProps = {
  fullName: "Jean-Paul Ainam",
  url: "https://discolaire.com/invite/",
};

export default WelcomeEmail;
