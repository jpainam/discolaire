import { env } from "~/env";
import { CURRENCY } from "~/lib/constants";

export function getCdnUrl() {
  if (env.NODE_ENV == "production") {
    return "https://discolaire-public.s3.eu-central-1.amazonaws.com";
  }
  return env.NEXT_PUBLIC_BASE_URL;
}

export function getTitle({ trimestreId }: { trimestreId: string }) {
  if (trimestreId.includes("1")) {
    return {
      title: "BULLETIN SCOLAIRE DU PREMIER TRIMESTRE",
      seq1: "SEQ1",
      seq2: "SEQ2",
    };
  }
  if (trimestreId.includes("2")) {
    return {
      title: "BULLETIN SCOLAIRE DU SECOND TRIMESTRE",
      seq1: "SEQ3",
      seq2: "SEQ4",
    };
  }
  return {
    title: "BULLETIN SCOLAIRE DU TROISIEME TRIMESTRE",
    seq1: "SEQ5",
    seq2: "SEQ6",
  };
}

export function getAssetUrl(asset: "image" | "avatar") {
  const isLocal = env.NEXT_PUBLIC_DEPLOYMENT_ENV === "local";
  let assetUrl = "";
  if (isLocal) {
    if (asset === "image") {
      assetUrl = `${env.NEXT_PUBLIC_MINIO_URL}/${env.S3_IMAGE_BUCKET_NAME}`;
    } else {
      assetUrl = `${env.NEXT_PUBLIC_MINIO_URL}/${env.S3_AVATAR_BUCKET_NAME}`;
    }
  } else {
    if (asset === "image") {
      assetUrl = `https://${env.S3_IMAGE_BUCKET_NAME}.s3.eu-central-1.amazonaws.com`;
    } else {
      assetUrl = `https://${env.S3_AVATAR_BUCKET_NAME}.s3.eu-central-1.amazonaws.com`;
    }
  }
  if (assetUrl.includes("localhost")) {
    assetUrl = assetUrl.replace("localhost", "127.0.0.1");
  }
  return assetUrl;
}

export function formatCurrency(
  value: number,
  locale = "fr-FR",
  currency = CURRENCY,
) {
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).formatToParts(value);

  let formatted = "";
  for (const p of parts) {
    if (p.type === "group") {
      formatted += " "; // enforce space separator
    } else {
      formatted += p.value;
    }
  }
  return formatted;
}
