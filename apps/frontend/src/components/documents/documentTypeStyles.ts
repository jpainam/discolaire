import type { LucideIcon } from "lucide-react";
import { Archive, File, FileText, Image, Video } from "lucide-react";

import type { DocumentFileCategory } from "@repo/utils";

export type DocumentDisplayType =
  | "images"
  | "videos"
  | "documents"
  | "archives"
  | "others";

export const iconMap: Record<DocumentDisplayType, LucideIcon> = {
  images: Image,
  videos: Video,
  documents: FileText,
  archives: Archive,
  others: File,
};

export const colorsMap: { type: DocumentDisplayType; color: string }[] = [
  { type: "images", color: "#8B5CF6" },
  { type: "videos", color: "#EC4899" },
  { type: "documents", color: "#F59E0B" },
  { type: "archives", color: "#10B981" },
  { type: "others", color: "#6B7280" },
];

const displayTypeByCategory: Record<DocumentFileCategory, DocumentDisplayType> =
  {
    image: "images",
    video: "videos",
    document: "documents",
    archived: "archives",
    other: "others",
  };

export const getColor = (type: DocumentDisplayType) => {
  return colorsMap.find((c) => c.type === type)?.color ?? "#6B7280";
};

export const getDocumentDisplayType = (
  category: DocumentFileCategory,
): DocumentDisplayType => {
  return displayTypeByCategory[category];
};
