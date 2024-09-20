import type { Metadata } from "next";

import { BrandCanvas } from "~/components/brand-canvas";

export const metadata: Metadata = {
  title: "Branding",
  description: "Download branding assets, logo, screenshots and more.",
};

export default function Page() {
  return <BrandCanvas />;
}
