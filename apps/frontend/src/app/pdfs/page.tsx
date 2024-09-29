"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";

// https://github.com/diegomura/react-pdf/issues/2886
// type ReactNode | ReactElement<BlobProviderParams, string | JSXElementConstructor<any>>.
import { MyInvoice } from "./MyInvoice";

export default function Page() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {loaded && (
        <PDFDownloadLink
          className="text-decoration-none"
          document={<MyInvoice />}
          fileName={`Invoice-example.pdf`}
        >
          Download pdf
        </PDFDownloadLink>
      )}
    </>
  );
}
