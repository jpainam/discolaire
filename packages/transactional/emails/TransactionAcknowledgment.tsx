import {
  Body,
  Column,
  Container,
  Head,
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
import { ArrowRight } from "lucide-react";

import { env } from "../env";

interface TransactionAcknowledgmentProps {
  transactionId: number;
}

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export const TransactionAcknowledgment = ({
  transactionId,
}: TransactionAcknowledgmentProps) => {
  const previewText = `Join Transaction on Discolaire`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/vercel-logo.png`}
                width="40"
                height="37"
                alt="Vercel"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black"></Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              {transactionId}
            </Text>
            <Text className="text-[14px] leading-[24px] text-black"></Text>
            <Section>
              <Row>
                <Column align="right"></Column>
                <Column align="center">
                  <ArrowRight className="h-4 w-4 text-black" />
                </Column>
                <Column align="left"></Column>
              </Row>
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center"></Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for This invite was s located in were
              not expecting this invitation, you can ignore this email. If you
              are concerned about your account's safety, please reply to this
              email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
