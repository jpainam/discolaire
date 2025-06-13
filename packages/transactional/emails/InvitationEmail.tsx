import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

import { Footer } from "../components/footer";

const InvitationEmail = ({
  inviterName = "Alex Chen",
  inviteeName = "Jamie Smith",
  schoolName = "Design Collective",
  inviteLink = "https://app.example.com/invite/team/abc123",
}) => {
  return (
    <Html>
      <Head />
      <Preview>
        Vous avez été invité à rejoindre {schoolName} sur discolaire.com
      </Preview>
      <Tailwind>
        <Body className="bg-[#f5f5f7] py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[12px] bg-white p-[32px] shadow-sm">
            <Heading className="m-0 mb-[24px] text-[18px] font-bold text-black">
              Rejoindre {schoolName}
            </Heading>

            <Text className="mb-[24px] text-[16px] leading-[24px] text-[#333333]">
              Bonjour {inviteeName},
            </Text>

            <Text className="mb-[32px] text-[16px] leading-[24px] text-[#333333]">
              <strong>{inviterName}</strong> vous a invité à rejoindre la
              plateforme de gestion scolaire de <strong>{schoolName}</strong>.
            </Text>

            <Button
              href={inviteLink}
              className="box-border rounded-[8px] bg-[#0071e3] px-[24px] py-[12px] text-center text-[16px] font-medium text-white no-underline"
            >
              Accepter l'invitation
            </Button>

            <Hr className="my-[32px] border-[#e6e6e6]" />

            <Text className="text-[14px] text-[#666666]">
              Si vous ne vous attendiez pas à cette invitation, vous pouvez
              ignorer cet e-mail. Si vous avez des questions, veuillez
              contacter, support@discolaire.com.
            </Text>
          </Container>
          <Footer />
        </Body>
      </Tailwind>
    </Html>
  );
};

InvitationEmail.PreviewProps = {
  inviterName: "Alex Chen",
  inviteeName: "Jamie Smith",
  teamName: "Design Collective",
  inviteLink: "https://app.example.com/invite/team/abc123",
};

export default InvitationEmail;
