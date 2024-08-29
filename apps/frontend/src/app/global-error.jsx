// @ts-nocheck
"use client";

import { useEffect } from "react";
import Error from "next/error";

export default function GlobalError({ error }) {
  useEffect(() => {
    //Sentry.captureException(error);
    console.log(error);
  }, [error]);

  return (
    <html>
      <body>
        <Error error={error} />
      </body>
    </html>
  );
}
