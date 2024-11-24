import { Font } from "@react-email/components";

export function Head() {
  return (
    <head>
      <Font
        fontFamily="Geist"
        fallbackFontFamily="Helvetica"
        webFont={{
          url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />

      <Font
        fontFamily="Geist"
        fallbackFontFamily="Helvetica"
        webFont={{
          url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
          format: "woff2",
        }}
        fontWeight={500}
        fontStyle="normal"
      />
    </head>
  );
}
