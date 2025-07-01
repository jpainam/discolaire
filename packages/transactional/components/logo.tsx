import { Img, Section } from "@react-email/components";

import { env } from "../env";

export function Logo({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <Section>
      {logoUrl && (
        <Img
          src={`${env.NEXT_PUBLIC_BASE_URL}/api/download/images/${logoUrl}`}
          width="100"
          height="100"
          alt="Logo"
          className="mx-auto my-0 block"
        />
      )}
    </Section>
  );
}
