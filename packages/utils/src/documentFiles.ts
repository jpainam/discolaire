export type DocumentFileCategory =
  | "image"
  | "video"
  | "document"
  | "archived"
  | "other";

const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/tiff",
  "image/svg+xml",
  "image/heic",
  "image/heif",
]);
const VIDEO_MIMES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
  "video/mpeg",
  "video/3gpp",
]);
const DOCUMENT_MIMES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);
const ARCHIVE_MIMES = new Set([
  "application/zip",
  "application/x-zip-compressed",
]);
const IMAGE_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".tif",
  ".tiff",
  ".svg",
  ".heic",
  ".heif",
]);
const VIDEO_EXTS = new Set([
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".webm",
  ".m4v",
  ".3gp",
  ".mpeg",
  ".mpg",
]);
const DOCUMENT_EXTS = new Set([".doc", ".docx", ".pdf", ".xls", ".xlsx"]);
const ARCHIVE_EXTS = new Set([".zip"]);

const getExtension = (url: string) => {
  const cleanUrl = url.split(/[?#]/)[0] ?? "";
  const lastDot = cleanUrl.lastIndexOf(".");
  if (lastDot === -1) {
    return null;
  }
  return cleanUrl.slice(lastDot).toLowerCase();
};

export const getDocumentFileCategory = (
  mime: string | null,
  url: string,
): DocumentFileCategory => {
  const normalizedMime = mime?.toLowerCase();
  if (normalizedMime) {
    if (
      normalizedMime.startsWith("image/") ||
      IMAGE_MIMES.has(normalizedMime)
    ) {
      return "image";
    }
    if (
      normalizedMime.startsWith("video/") ||
      VIDEO_MIMES.has(normalizedMime)
    ) {
      return "video";
    }
    if (DOCUMENT_MIMES.has(normalizedMime)) {
      return "document";
    }
    if (ARCHIVE_MIMES.has(normalizedMime)) {
      return "archived";
    }
  }
  const ext = getExtension(url);
  if (ext) {
    if (IMAGE_EXTS.has(ext)) {
      return "image";
    }
    if (VIDEO_EXTS.has(ext)) {
      return "video";
    }
    if (DOCUMENT_EXTS.has(ext)) {
      return "document";
    }
    if (ARCHIVE_EXTS.has(ext)) {
      return "archived";
    }
  }
  return "other";
};

export const documentFileTypeSets = {
  imageMimes: IMAGE_MIMES,
  videoMimes: VIDEO_MIMES,
  documentMimes: DOCUMENT_MIMES,
  archiveMimes: ARCHIVE_MIMES,
  imageExts: IMAGE_EXTS,
  videoExts: VIDEO_EXTS,
  documentExts: DOCUMENT_EXTS,
  archiveExts: ARCHIVE_EXTS,
} as const;
