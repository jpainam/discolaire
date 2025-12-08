import { Img, Section } from "@react-email/components";

export function Logo({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <Section>
      {logoUrl && (
        <Img
          src={`https://discolaire-images-public-uploads-g5v2c4o.s3.eu-central-1.amazonaws.com/${logoUrl}`}
          width="100"
          height="100"
          alt="Logo"
          className="mx-auto my-0 block"
        />
      )}
    </Section>
  );
}
