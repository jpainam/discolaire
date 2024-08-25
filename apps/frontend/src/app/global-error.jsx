"use client";

import Error from "next/error";
import { useEffect } from "react";

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
