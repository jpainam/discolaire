import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Footer } from "../components/footer";
import { Head } from "../components/Head";
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

interface Props {
  email?: string;
  invitedByEmail?: string;
  invitedByName?: string;
  inviteLink?: string;
  locale: string;
  school: School;
}

export const InviteEmail = ({
  school = defaultSchool,
  invitedByEmail = "example@example.com",
  invitedByName = "Dupon Pierre",
  inviteLink = "http://localhost:3000/invite/jnwe9203frnwefl239jweflasn1230oqef",
  locale = "fr",
}: Props) => {
  const { t } = geti18n({ locale });

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{t("invite.preview", { name: school.name })}</Preview>

        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto mb-[40px] max-w-[600px] border-transparent px-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo logoUrl={school.logo} />
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-[#121212]">
              {t("invite.title1")} <strong>{school.name}</strong>{" "}
              {t("invite.title2")} <strong>Discolaire</strong>
            </Heading>

            <Text className="text-[14px] leading-[24px] text-[#121212]">
              {invitedByName} (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-[#121212] no-underline"
              >
                {invitedByEmail}
              </Link>
              ) {t("invite.link1")} <strong>{school.name}</strong>{" "}
              {t("invite.link2")} <strong>Discolaire</strong>.
            </Text>
            <Section className="mb-[42px] mt-[32px] text-center">
              <Button
                style={{
                  ...button,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                }}
                href={inviteLink}
              >
                {t("invite.join")}
              </Button>
            </Section>

            <Text className="break-all text-[14px] leading-[24px] text-[#707070]">
              {t("invite.link3")}:{" "}
              <Link href={inviteLink} className="text-[#707070] underline">
                {inviteLink}
              </Link>
            </Text>

            <br />
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
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

export default InviteEmail;
