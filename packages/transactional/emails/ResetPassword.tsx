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

import { geti18n } from "../locales";

export const ResetPassword = ({
  username = "Dupont",
  resetLink = "https://example.com/reset-password",
  school = "Institut Polyvalent Wague",
}: {
  username: string;
  resetLink: string;
  school: string;
}) => {
  const { t } = geti18n({ locale: "fr" });
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{t("reinitialize_password")}</Preview>
        <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
          {school}
        </Heading>
        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            {/* <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
              {t("reinitialize_password")}
            </Heading> */}
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Hello {username},
              <br />
              <br />
              {t("reinitialize_password_text")}
            </Text>

            <Section className="mt-[32px] mb-[32px] text-center">
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
  borderRadius: "8px",
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
