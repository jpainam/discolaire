import { Img, Section } from "@react-email/components";

export function Logo({ logoUrl }: { logoUrl?: string }) {
  console.log(logoUrl);
  return (
    <Section className="mt-[32px]">
      {logoUrl && (
        <Img
          src={`${logoUrl}`}
          width="100"
          height="100"
          alt="Logo"
          className="mx-auto my-0 block"
        />
      )}
    </Section>
  );
}
