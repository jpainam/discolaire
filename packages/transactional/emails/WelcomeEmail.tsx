import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Img,
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
import { getAppUrl } from "../utils";

interface Props {
  fullName: string;
  locale: string;
}

const baseUrl = getAppUrl();

export const WelcomeEmail = ({
  fullName = "Viktor Hofte",
  locale = "fr",
}: Props) => {
  const { t } = geti18n({ locale });
  const firstName = fullName.split(" ").at(0);
  const text = `Hi ${firstName}, Welcome to Midday! I'm Pontus, one of the founders. It's really important to us that you have a great experience ramping up.`;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{text}</Preview>

        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto mb-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo />
            <Heading className="mx-0 my-[30px] p-0 text-center text-[21px] font-normal text-[#121212]">
              Welcome to Midday
            </Heading>

            <br />

            <span className="font-medium">Hi {firstName},</span>
            <Text className="text-[#121212]">
              Welcome to Midday! I'm Pontus, one of the founders.
              <br />
              <br />
              We've been working on Midday for the past months, and during this
              time, we've implemented the basic functionality to get started.
              However, with your feedback, we can make the right decisions to
              help run your business smarter.
              <br />
              <br />
              During our beta phase, you may encounter some bugs, but we
              genuinely want all your feedback.
              <br />
              <br />
              Should you have any questions, please don't hesitate to reply
              directly to this email or to{" "}
              <Link
                href="https://cal.com/pontus-midday/15min"
                className="text-[#121212] underline"
              >
                schedule a call with me
              </Link>
              .
            </Text>

            <br />

            <Img
              src={`${baseUrl}/email/founders.jpeg`}
              alt="Founders"
              className="mx-auto my-0 block w-full"
            />

            <Text className="text-[#707070]">Best regards, founders</Text>

            <Img
              src={`${baseUrl}/email/signature.png`}
              alt="Signature"
              className="h-[20px]w-full block"
            />

            <br />
            <br />

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
                {t("reinitialize")}
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
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

export default WelcomeEmail;
