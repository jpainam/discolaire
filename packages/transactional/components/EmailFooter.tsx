import { Hr, Link, Section, Text } from "@react-email/components";

interface EmailFooterProps {
  schoolName?: string;
  /**
   * For transactional emails (password reset, invitations) this can be omitted.
   * Required for marketing / bulk emails to comply with CAN-SPAM / GDPR.
   */
  unsubscribeUrl?: string;
}

export function EmailFooter({ schoolName, unsubscribeUrl }: EmailFooterProps) {
  return (
    <>
      <Hr className="mt-[32px] border-[#e6e6e6]" />
      <Section className="mt-[24px] pb-[16px] text-center">
        {schoolName && (
          <Text className="m-0 text-[12px] text-[#8c8c8c]">
            {schoolName} &bull; Propulsé par Discolaire
          </Text>
        )}
        <Text className="m-0 mt-[8px] text-[12px] text-[#8c8c8c]">
          &copy; {new Date().getFullYear()} Discolaire. Tous droits réservés.
        </Text>
        {unsubscribeUrl && (
          <Text className="m-0 mt-[8px] text-[12px] text-[#8c8c8c]">
            <Link href={unsubscribeUrl} className="text-[#8c8c8c] underline">
              Se désabonner
            </Link>
          </Text>
        )}
      </Section>
    </>
  );
}
