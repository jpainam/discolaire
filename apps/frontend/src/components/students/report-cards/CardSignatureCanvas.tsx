"use client";

import { useRef, useState } from "react";

import { SignatureInput } from "@repo/ui/components/signature-input";

export function CardSignatureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [_value, setValue] = useState<string | null>(null);
  return (
    <SignatureInput
      //@ts-expect-error TODO: Fix this
      canvasRef={canvasRef}
      onSignatureChange={(val) => setValue(val)}
    />
  );
}
