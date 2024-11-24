import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Logo } from "../components/logo";
import { geti18n } from "../locales";
import { getAssetUrl } from "../utils";

interface School {
  logo?: string | null;
  name: string;
  id: string;
}

const assetUrl = getAssetUrl();
const defaultSchool = {
  logo: `${assetUrl}/images/logo-round.png`,
  name: "Institut Polyvalent Wague",
  id: "1",
};

export const ResetPassword = ({
  username = "Dupont",
  resetLink = "https://example.com/reset-password",
  locale = "fr",
  school = defaultSchool,
}: {
  username: string;
  resetLink: string;
  school: School;
  locale: string;
}) => {
  const { t } = geti18n({ locale });
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{t("reinitialize_password")}</Preview>
        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto mb-[40px] max-w-[600px] border-transparent px-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo logoUrl={school.logo} />
            <Heading className="mx-0 my-[30px] p-0 text-center text-[21px] font-normal text-[#121212]">
              {t("reinitialize_password")}
            </Heading>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Hello {username},
              <br />
              <br />
              {t("reinitialize_password_text")}
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                style={{
                  ...button,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                }}
                href={resetLink}
              >
                {t("reinitialize")}
              </Button>
            </Section>
            <Text style={text}>{t("renitialize_password_alt")}</Text>
            <Link href={resetLink} style={link}>
              {resetLink}
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007bff",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const link = {
  color: "#007bff",
  textDecoration: "underline",
};

export default ResetPassword;
