import {
  Body,
  Container,
  Font,
  Head,
  Heading,
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

interface FeedbackEmailProps {
  emailSender?: string;
  usernameSender?: string;
  userId?: string;
  message?: string;
  school: School;
}

const defaultSchool = {
  logo: `logo-round.png`,
  name: "Institut Polyvalent Wague",
  id: "1",
};

export const FeedbackEmail = ({
  usernameSender = "username",
  school = defaultSchool,
  userId = "1",
  message = "Email de Feedback",
  emailSender = "example@gmail.com",
}: FeedbackEmailProps) => {
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
        <Preview>Feedback email</Preview>
        <Body className="mx-auto my-auto bg-[#f5f5f5] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[8px] border border-[#E8E7E1] bg-white p-[32px]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <EmailHeader logoUrl={school.logo} schoolName={school.name} />
            <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
              Email de Feedback de {usernameSender}
            </Heading>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              <strong>{emailSender}</strong>
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              {message}
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Cordialement, ID {userId}
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

export default FeedbackEmail;
