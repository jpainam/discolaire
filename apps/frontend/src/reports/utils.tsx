import { env } from "~/env";

export function getCdnUrl() {
  if (env.NODE_ENV == "production") {
    return "https://discolaire-public.s3.eu-central-1.amazonaws.com";
  }
  return env.NEXT_PUBLIC_BASE_URL;
}

export function getAppreciations(grade?: number | null) {
  if (grade === undefined || grade == null) return "";
  if (grade >= 0 && grade < 4) {
    return "Nul";
  } else if (grade >= 4 && grade < 6) {
    return "Très faible";
  } else if (grade >= 6 && grade < 8) {
    return "Faible";
  } else if (grade >= 8 && grade < 9) {
    return "Insuffisant";
  } else if (grade >= 9 && grade < 10) {
    return "Médiocre";
  } else if (grade >= 10 && grade < 11) {
    return "Moyen";
  } else if (grade >= 11 && grade < 12) {
    return "Passable";
  } else if (grade >= 12 && grade < 14) {
    return "Assez bien";
  } else if (grade >= 14 && grade < 16) {
    return "Bien";
  } else if (grade >= 16 && grade < 18) {
    return "Très bien";
  } else if (grade >= 18 && grade <= 20) {
    return "Excellent";
  }
  return "Pas definie";
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
