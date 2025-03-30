import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

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
            <Heading className="m-0 mb-[24px] text-[24px] font-bold text-black">
              Rejoindre {schoolName}
            </Heading>

            <Text className="mb-[24px] text-[16px] leading-[24px] text-[#333333]">
              Bonjour {inviteeName},
            </Text>

            <Text className="mb-[32px] text-[16px] leading-[24px] text-[#333333]">
              <strong>{inviterName}</strong> vous a invité à rejoindre{" "}
              <strong>{schoolName}</strong>. Rejoignez notre plateforme de
              gestion scolaire pour le suivi scolaire des élèves et la
              communication entre les enseignants et les parents.
            </Text>

            <Button
              href={inviteLink}
              className="box-border rounded-[8px] bg-[#0071e3] px-[24px] py-[12px] text-center text-[16px] font-medium text-white no-underline"
            >
              Accepter l'invitation
            </Button>

            <Text className="my-[24px] text-[14px] text-[#666666]">
              Ou copiez et collez cette URL dans votre navigateur :{" "}
              <Link href={inviteLink} className="text-[#0071e3] underline">
                {inviteLink}
              </Link>
            </Text>

            <Hr className="my-[32px] border-[#e6e6e6]" />

            <Text className="text-[14px] text-[#666666]">
              Si vous ne vous attendiez pas à cette invitation, vous pouvez
              ignorer cet e-mail. Si vous avez des questions, veuillez
              contacter, support@discolaire.com.
            </Text>
          </Container>

          <Container className="mx-auto mt-[32px] max-w-[600px] text-center">
            <Text className="m-0 text-[12px] text-[#666666]">
              Example, Inc. • 123 Example Street, San Francisco, CA 94103
            </Text>
            <Text className="m-0 mt-[8px] text-[12px] text-[#666666]">
              <Link href="#" className="text-[#666666] underline">
                Unsubscribe
              </Link>{" "}
              • © {new Date().getFullYear()} Example
            </Text>
          </Container>
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
