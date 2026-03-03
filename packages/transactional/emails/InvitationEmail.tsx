import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

import { EmailFooter } from "../components/EmailFooter";
import { EmailHeader } from "../components/EmailHeader";

const InvitationEmail = ({
  inviteeName = "Jamie Smith",
  schoolName = "Design Collective",
  logo = `logo-round.png`,
  inviteLink = "https://app.example.com/invite/team/abc123",
}) => {
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
        <Preview>
          Vous avez été invité à rejoindre {schoolName} sur discolaire.com
        </Preview>
        <Body className="bg-[#f5f5f7] py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[12px] bg-white p-[32px] shadow-sm">
            <EmailHeader logoUrl={logo} schoolName={schoolName} />
            <Text className="mb-[24px] text-[16px] leading-[24px] text-[#333333]">
              Bonjour {inviteeName},
            </Text>
            <Text className="mb-[32px] text-[16px] leading-[24px] text-[#333333]">
              Vous êtes invité(e) à rejoindre la plateforme de gestion scolaire
              de <strong>{schoolName}</strong>.
            </Text>
            <Button
              href={inviteLink}
              className="box-border rounded-[8px] bg-[#0071e3] px-[24px] py-[12px] text-center text-[16px] font-medium text-white no-underline"
            >
              Accepter l&apos;invitation
            </Button>
            <Hr className="my-[32px] border-[#e6e6e6]" />
            <Text className="text-[14px] text-[#666666]">
              Si vous ne vous attendiez pas à cette invitation, vous pouvez
              ignorer cet e-mail. Si vous avez des questions, veuillez
              contacter support@discolaire.com.
            </Text>
            <EmailFooter schoolName={schoolName} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InvitationEmail.PreviewProps = {
  inviteeName: "Jamie Smith",
  schoolName: "Design Collective",
  inviteLink: "https://app.example.com/invite/team/abc123",
};

export default InvitationEmail;
