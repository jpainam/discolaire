import { Img, Section, Text } from "@react-email/components";

interface EmailHeaderProps {
  logoUrl?: string | null;
  schoolName?: string;
}

export function EmailHeader({ logoUrl, schoolName }: EmailHeaderProps) {
  return (
    <Section className="mb-[32px] text-center">
      {logoUrl && (
        <Img
          src={logoUrl}
          width="80"
          height="80"
          alt={schoolName ?? "Logo"}
          className="mx-auto mb-[12px] block rounded-full object-cover"
        />
      )}
      {schoolName && (
        <Text className="m-0 text-[18px] font-semibold text-[#121212]">
          {schoolName}
        </Text>
      )}
    </Section>
  );
}
