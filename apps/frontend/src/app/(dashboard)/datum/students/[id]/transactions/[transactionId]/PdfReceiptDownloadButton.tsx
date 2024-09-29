"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Printer } from "lucide-react";

import { useLocale } from "@repo/hooks/use-locale";
import { Button } from "@repo/ui/button";

import type { PdfReceiptProps } from "./PdfReceipt";
import { PdfReceipt } from "./PdfReceipt";

export function PdfReceiptDownloadButton(props: PdfReceiptProps) {
  const [loaded, setLoaded] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {loaded && (
        <PDFDownloadLink
          className="text-decoration-none"
          document={<PdfReceipt {...props} />}
          fileName={`Invoice-example.pdf`}
        >
          <Button variant={"outline"} size={"sm"}>
            <Printer className="mr-2 h-4 w-4" />
            {t("print")}
          </Button>
        </PDFDownloadLink>
      )}
    </>
  );
}
