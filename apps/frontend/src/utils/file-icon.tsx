import {
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  VideoIcon,
} from "lucide-react";

import { cn } from "~/lib/utils";

export const getFileIcon = (
  file: {
    file: File | { type: string; name: string };
  },
  className?: string,
) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  if (
    fileType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    fileType.includes("word") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  ) {
    return <FileTextIcon className={cn("size-4 opacity-60", className)} />;
  } else if (
    fileType.includes("zip") ||
    fileType.includes("archive") ||
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar")
  ) {
    return <FileArchiveIcon className={cn("size-4 opacity-60", className)} />;
  } else if (
    fileType.includes("excel") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return (
      <FileSpreadsheetIcon className={cn("size-4 opacity-60", className)} />
    );
  } else if (fileType.includes("video/")) {
    return <VideoIcon className={cn("size-4 opacity-60", className)} />;
  } else if (fileType.includes("audio/")) {
    return <HeadphonesIcon className={cn("size-4 opacity-60", className)} />;
  } else if (fileType.startsWith("image/")) {
    return <ImageIcon className={cn("size-4 opacity-60", className)} />;
  }
  return <FileIcon className={cn("size-4 opacity-60", className)} />;
};
