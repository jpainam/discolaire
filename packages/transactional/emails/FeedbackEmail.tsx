import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

import { Logo } from "../components/logo";
import { getAssetUrl } from "../utils";

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
const assetUrl = getAssetUrl();
const defaultSchool = {
  logo: `${assetUrl}/images/logo-round.png`,
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
    <Html>
      <Tailwind>
        <Head />
        <Preview>Feedback email</Preview>

        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo logoUrl={`${assetUrl}/images/logo-round.png`} />
            <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
              Email de Feedback de {usernameSender}
            </Heading>

            <br />

            <span className="font-medium">{emailSender}</span>
            <Text className="text-[#121212]">{message}</Text>
            <Text className="text-[#121212]">
              Cordialement, ID {userId} <br />
              La direction <br />
              {school.name}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default FeedbackEmail;
