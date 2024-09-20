import type { Metadata } from "next";
import Image from "next/image";
import appIcon from "public/app-icon.png";

import { Button } from "@repo/ui/button";

import { CopyInput } from "~/components/copy-input";
import { Keyboard } from "~/components/keyboard";

export const metadata: Metadata = {
  title: "Download",
  description:
    "With Midday on Mac you have everything accessible just one click away.",
};

export default function Page() {
  return (
    <div className="container mb-12 flex flex-col items-center text-center md:mb-48">
      <h1 className="mb-24 mt-24 text-center text-5xl font-medium">
        Always at your fingertips.
      </h1>

      <Keyboard />

      <Image
        src={appIcon}
        alt="Midday App"
        width={120}
        height={120}
        quality={100}
        className="mt-12 h-[80px] w-[80px] md:mt-0 md:h-auto md:w-auto"
      />
      <p className="mb-4 mt-8 text-2xl font-medium">Midday for Mac</p>
      <p className="font-sm max-w-[500px] text-[#878787]">
        With Midday on Mac you have everything <br />
        accessible just one click away.
      </p>

      <a href="https://go.midday.ai/d" download>
        <Button
          variant="outline"
          className="mt-8 h-12 border border-primary px-6"
        >
          Download
        </Button>
      </a>

      <p className="mt-4 text-xs text-[#878787]">
        Supports apple silicon & intel
      </p>

      <CopyInput
        value="curl -sL https://go.midday.ai/d | tar -xz"
        className="mt-8 hidden max-w-[410px] rounded-full font-mono font-normal md:block"
      />
    </div>
  );
}
