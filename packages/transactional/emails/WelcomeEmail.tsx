import {
  Body,
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Footer } from "../components/footer";
import { Head } from "../components/Head";
import { Logo } from "../components/logo";
import { geti18n } from "../locales";
import { getAppUrl, getAssetUrl } from "../utils";

interface Props {
  fullName: string;
  locale: string;
}

const baseUrl = getAppUrl();
const assetUrl = getAssetUrl();

export const WelcomeEmail = ({
  fullName = "Jean-Paul Ainam",
  locale = "fr",
}: Props) => {
  const { t } = geti18n({ locale });

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{t("welcome_text1")}</Preview>

        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto mb-[40px] max-w-[600px] border-transparent px-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo />
            <Heading className="mx-0 my-[30px] p-0 text-center text-[21px] font-normal text-[#121212]">
              {t("welcome_to_discolaire")}
            </Heading>

            <br />

            <span className="font-medium">Hi {fullName},</span>
            <Text className="text-[#121212]">{t("welcome_text1")}</Text>
            <Text className="text-[#121212]">{t("welcome_title1")}</Text>
            <ul className="text-[#121212]">
              <li>
                <Text>{t("welcome_text2")}</Text>
              </li>
              <li>
                <Text>{t("welcome_text3")}</Text>
              </li>
              <li>
                <Text>{t("welcome_text4")}</Text>
              </li>
              <li>
                <Text>{t("welcome_text5")}</Text>
              </li>
            </ul>
            <Text>{t("welcome_text6")}</Text>

            <Text>
              <strong>{t("welcome_text7")}</strong>
              {"  "}
              {t("welcome_text8")}
            </Text>
            <Hr />
            <Text className="text-[#707070]">{t("welcome_text9")}</Text>
            <Text>
              <strong>Jean-Paul Ainam</strong>
            </Text>
            <Img
              src={`${assetUrl}/images/signature.png`}
              alt="Signature"
              className="block h-[20px]"
            />

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                style={{
                  ...button,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                }}
                href={`${baseUrl}`}
              >
                {t("get_started")}
              </Button>
            </Section>
            <br />
            <Footer locale={locale} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
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

export default WelcomeEmail;
