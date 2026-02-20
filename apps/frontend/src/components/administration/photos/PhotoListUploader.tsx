"use client";

import { useMemo, useState } from "react";
import { BadgeCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { getBucket, uploadFile } from "~/actions/upload";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useModal } from "~/hooks/use-modal";
import { DeleteIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useSchool } from "~/providers/SchoolProvider";

type UploadStatus = "queued" | "uploading" | "uploaded" | "error";

type StatusMap = Record<string, UploadStatus>;

function fileKey(f: File) {
  // Stable enough for UI keys/status tracking
  return `${f.name}::${f.size}::${f.lastModified}`;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
) {
  const queue = [...items];
  const runners = Array.from({ length: Math.max(1, limit) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!item) return;
      await worker(item);
    }
  });
  await Promise.all(runners);
}

export function PhotoListUploader({
  initialFiles,
  entityType,
}: {
  initialFiles: File[];
  entityType: "student" | "staff" | "contact";
}) {
  const { closeModal } = useModal();

  const [files, setFiles] = useState<File[]>(() => initialFiles);
  const initialStatus = useMemo<StatusMap>(() => {
    return Object.fromEntries(
      files.map((f) => [fileKey(f), "queued" as const]),
    );
  }, [files]);
  const [status, setStatus] = useState<StatusMap>(() => initialStatus);
  const [isUploading, setIsUploading] = useState(false);

  const t = useTranslations();

  const ensureStatus = (nextFiles: File[]) => {
    setStatus((prev) => {
      const next: StatusMap = { ...prev };
      for (const f of nextFiles) {
        const k = fileKey(f);
        next[k] ??= "queued";
      }
      // prune removed files
      const allowed = new Set(nextFiles.map(fileKey));
      for (const k of Object.keys(next)) {
        if (!allowed.has(k)) delete next[k];
      }
      return next;
    });
  };

  const removeFile = (k: string) => {
    const next = files.filter((f) => fileKey(f) !== k);
    setFiles(next);
    ensureStatus(next);
  };

  const { school } = useSchool();

  const uploadOne = async (f: File, bucket: string) => {
    const k = fileKey(f);
    setStatus((prev) => ({ ...prev, [k]: "uploading" }));
    try {
      const destination = `${school.code}/${entityType}/${f.name.split("/").pop()}`;
      await uploadFile({
        file: f,
        destination: destination,
        bucket,
      });
      setStatus((prev) => ({ ...prev, [k]: "uploaded" }));
    } catch {
      setStatus((prev) => ({ ...prev, [k]: "error" }));
    }
  };

  const handleUpload = async () => {
    if (isUploading || files.length === 0) return;
    const bucket = await getBucket("avatar");
    setIsUploading(true);
    try {
      // Upload only those not already uploaded
      const pending = files.filter((f) => {
        const s = status[fileKey(f)];
        return s !== "uploaded" && s !== "uploading";
      });

      // Tune concurrency as needed (2–5 is usually a good start)
      await runWithConcurrency(pending, 3, (file) => uploadOne(file, bucket));
    } finally {
      setIsUploading(false);
    }
  };

  const uploadedCount = files.filter(
    (f) => status[fileKey(f)] === "uploaded",
  ).length;

  return (
    <div className="flex flex-col gap-2">
      <div className="no-scrollbar max-h-[70vh] overflow-y-auto">
        <Table>
          <TableCaption>
            {uploadedCount}/{files.length} uploaded
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {files.map((f) => {
              const k = fileKey(f);
              const s = status[k] ?? "queued";

              return (
                <TableRow key={k}>
                  <TableCell className="max-w-[420px] truncate" title={f.name}>
                    {f.name}
                  </TableCell>

                  <TableCell>{formatBytes(f.size)}</TableCell>

                  <TableCell>
                    <Badge
                      variant={"secondary"}
                      className={cn(
                        s === "uploaded" && "bg-green-500 text-white",
                      )}
                    >
                      {s === "uploaded" && (
                        <>
                          <BadgeCheckIcon />
                          Uploaded
                        </>
                      )}
                      {s === "uploading" && (
                        <>
                          <Spinner />
                          Uploading…
                        </>
                      )}
                      {s === "queued" && <>Queued</>}
                    </Badge>

                    {s === "error" && (
                      <>
                        Failed
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isUploading}
                          onClick={async () => {
                            const bucket = await getBucket("avatar");
                            void uploadOne(f, bucket);
                          }}
                        >
                          Retry
                        </Button>
                      </>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="icon-sm"
                      variant="destructive"
                      disabled={isUploading || s === "uploading"}
                      onClick={() => removeFile(k)}
                      aria-label="Remove file"
                    >
                      <DeleteIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {files.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground py-8 text-center"
                >
                  No files selected
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" disabled={isUploading} onClick={closeModal}>
          {t("close")}
        </Button>

        <Button
          disabled={isUploading || files.length === 0}
          onClick={() => {
            if (uploadedCount != files.length) {
              void handleUpload();
            } else {
              closeModal();
            }
          }}
        >
          {isUploading && <Spinner />}
          {uploadedCount == files.length ? t("upload") : t("close")}
        </Button>
      </div>
    </div>
  );
}
