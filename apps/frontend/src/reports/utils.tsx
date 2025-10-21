import { env } from "~/env";

export function getCdnUrl() {
  if (env.NODE_ENV == "production") {
    return "https://discolaire-public.s3.eu-central-1.amazonaws.com";
  }
  return env.NEXT_PUBLIC_BASE_URL;
}

export function getTitle({ trimestreId }: { trimestreId: string }) {
  if (trimestreId == "trim1") {
    return {
      title: "BULLETIN SCOLAIRE DU PREMIER TRIMESTRE",
      seq1: "SEQ1",
      seq2: "SEQ2",
    };
  }
  if (trimestreId == "trim2") {
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

export function getAssetUrl(asset: string) {
  const isLocal = env.NEXT_PUBLIC_DEPLOYMENT_ENV === "local";
  if (isLocal) {
    if (asset === "images") {
      return `${env.NEXT_PUBLIC_MINIO_URL}/${env.S3_IMAGE_BUCKET_NAME}`;
    } else if (asset == "avatars") {
      return `${env.NEXT_PUBLIC_MINIO_URL}/${env.S3_AVATAR_BUCKET_NAME}`;
    }
  } else {
    if (asset === "images") {
      return `https://${env.S3_IMAGE_BUCKET_NAME}.s3.eu-central-1.amazonaws.com`;
    } else {
      return `https://${env.S3_AVATAR_BUCKET_NAME}.s3.eu-central-1.amazonaws.com`;
    }
  }
}
