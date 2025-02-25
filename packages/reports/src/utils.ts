/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function flatten({ values }: { values: any }) {
  const styles = Array.isArray(values) ? values : [values];

  const mergeStyles = styles.reduce((acc, style) => {
    const s = Array.isArray(style) ? flatten(style) : style;
    Object.keys(s).forEach((key) => {
      if (s[key] !== null && s[key] !== undefined) {
        acc[key] = s[key];
      }
    });
    return acc;
  }, {});
  return mergeStyles;
}

export function getCdnUrl() {
  if (process.env.NODE_ENV == "production") {
    return "https://discolaire-public.s3.eu-central-1.amazonaws.com";
  }
  return "http://localhost:3000";
}
