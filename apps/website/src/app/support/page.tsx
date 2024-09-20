import type { Metadata } from "next";

import { SupportForm } from "~/components/support-form";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Midday",
};

export default function Page() {
  return (
    <div className="m-auto max-w-[750px]">
      <h1 className="mb-16 mt-24 text-center text-5xl font-medium leading-snug">
        Support
      </h1>

      <SupportForm />
    </div>
  );
}
