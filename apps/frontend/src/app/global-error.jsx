"use client";

import { useEffect } from "react";
import Error from "next/error";

// @ts-ignore
export default function GlobalError({ error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    // https://github.com/facebook/react/issues/11538#issuecomment-350110297
    <html lang="en" className="notranslate" translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body>
        <Error error={error} statusCode={500} />
      </body>
    </html>
  );
}
