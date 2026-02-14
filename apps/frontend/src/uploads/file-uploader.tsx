"use client";

import * as React from "react";
import Image from "next/image";
import { FileTextIcon } from "@radix-ui/react-icons";
import { Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useControllableState } from "~/hooks/use-controllable-state";
import { cn, formatBytes } from "~/lib/utils";

type FileAccept = Record<string, string[]>;

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  accept?: FileAccept;
  maxSize?: number;
  maxFileCount?: number;
  multiple?: boolean;
  disabled?: boolean;
}

function toInputAccept(accept: FileAccept | undefined) {
  if (!accept) {
    return undefined;
  }

  const values = new Set<string>();
  for (const [mime, extensions] of Object.entries(accept)) {
    values.add(mime);
    for (const extension of extensions) {
      values.add(extension);
    }
  }

  return Array.from(values).join(",");
}

function isAcceptedFile(file: File, accept: FileAccept | undefined) {
  if (!accept || Object.keys(accept).length === 0) {
    return true;
  }

  const lowerCaseName = file.name.toLowerCase();
  const extension = lowerCaseName.includes(".")
    ? `.${lowerCaseName.split(".").pop()}`
    : "";

  return Object.entries(accept).some(([mime, extensions]) => {
    const normalizedExtensions = extensions.map((item) => item.toLowerCase());

    const extensionMatches =
      normalizedExtensions.length === 0
        ? true
        : normalizedExtensions.includes(extension);

    if (!file.type) {
      return extensionMatches;
    }

    if (mime === "*/*") {
      return extensionMatches;
    }

    if (mime.endsWith("/*")) {
      const typePrefix = mime.slice(0, -1);
      return file.type.startsWith(typePrefix) && extensionMatches;
    }

    return file.type === mime && extensionMatches;
  });
}

function withPreview(file: File) {
  if (!file.type.startsWith("image/")) {
    return file;
  }
  return Object.assign(file, {
    preview: URL.createObjectURL(file),
  });
}

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = {
      "application/pdf": [],
      "image/*": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    ...containerProps
  } = props;

  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const normalizedFiles = files ?? [];
  const previousFilesRef = React.useRef<File[]>(normalizedFiles);

  React.useEffect(() => {
    const previousFiles = previousFilesRef.current;
    const currentFiles = new Set(normalizedFiles);

    for (const file of previousFiles) {
      if (!currentFiles.has(file) && isFileWithPreview(file)) {
        URL.revokeObjectURL(file.preview);
      }
    }

    previousFilesRef.current = normalizedFiles;
  }, [normalizedFiles]);

  React.useEffect(() => {
    return () => {
      for (const file of previousFilesRef.current) {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      }
    };
  }, []);

  const effectiveMaxFileCount = Number.isFinite(maxFileCount)
    ? maxFileCount
    : Infinity;
  const allowMultiple = multiple || effectiveMaxFileCount > 1;

  const processFiles = React.useCallback(
    (incomingFiles: File[]) => {
      if (incomingFiles.length === 0) {
        return;
      }

      if (!allowMultiple && incomingFiles.length > 1) {
        toast.error("Cannot upload more than 1 file at a time");
        return;
      }

      const acceptedFiles = incomingFiles.filter((file) => {
        if (file.size > maxSize) {
          toast.error(
            `File ${file.name} exceeds max size of ${formatBytes(maxSize)}`,
          );
          return false;
        }

        if (!isAcceptedFile(file, accept)) {
          toast.error(`File ${file.name} was rejected`);
          return false;
        }

        return true;
      });

      if (acceptedFiles.length === 0) {
        return;
      }

      if (
        normalizedFiles.length + acceptedFiles.length >
        effectiveMaxFileCount
      ) {
        toast.error(`Cannot upload more than ${effectiveMaxFileCount} files`);
        return;
      }

      const nextFiles = acceptedFiles.map(withPreview);
      const updatedFiles = [...normalizedFiles, ...nextFiles];

      setFiles(updatedFiles);

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= effectiveMaxFileCount
      ) {
        const target =
          updatedFiles.length > 1 ? `${updatedFiles.length} files` : "file";

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([]);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
            return `${target} uploaded`;
          },
          error: `Failed to upload ${target}`,
        });
      }
    },
    [
      accept,
      allowMultiple,
      effectiveMaxFileCount,
      maxSize,
      normalizedFiles,
      onUpload,
      setFiles,
    ],
  );

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files ?? []);
      processFiles(selectedFiles);
    },
    [processFiles],
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (disabled) {
        return;
      }
      setIsDragging(false);
      const droppedFiles = Array.from(event.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [disabled, processFiles],
  );

  const handleDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
    },
    [],
  );

  const openFileDialog = React.useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const onRemove = React.useCallback(
    (index: number) => {
      if (!normalizedFiles[index]) {
        return;
      }
      const nextFiles = normalizedFiles.filter((_, i) => i !== index);
      setFiles(nextFiles);

      if (inputRef.current && nextFiles.length === 0) {
        inputRef.current.value = "";
      }
    },
    [normalizedFiles, setFiles],
  );

  const isDisabled =
    disabled || normalizedFiles.length >= effectiveMaxFileCount;

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={toInputAccept(accept)}
        multiple={allowMultiple}
        onChange={handleInputChange}
        disabled={isDisabled}
      />

      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        onClick={isDisabled ? undefined : openFileDialog}
        onDrop={isDisabled ? undefined : handleDrop}
        onDragOver={isDisabled ? undefined : handleDragOver}
        onDragLeave={isDisabled ? undefined : handleDragLeave}
        onKeyDown={(event) => {
          if (isDisabled) {
            return;
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFileDialog();
          }
        }}
        className={cn(
          "group border-muted-foreground/25 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition",
          "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          isDragging && "border-muted-foreground/50",
          isDisabled && "pointer-events-none opacity-60",
          className,
        )}
        {...containerProps}
      >
        {isDragging ? (
          <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
            <div className="rounded-full border border-dashed p-3">
              <UploadCloud
                className="text-muted-foreground size-7"
                aria-hidden="true"
              />
            </div>
            <p className="text-muted-foreground font-medium">
              Drop the files here
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
            <div className="rounded-full border border-dashed p-3">
              <UploadCloud
                className="text-muted-foreground size-7"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col gap-px">
              <p className="text-muted-foreground font-medium">
                Drag {`'n'`} drop files here, or click to select files
              </p>
              <p className="text-muted-foreground/70 text-sm">
                You can upload
                {effectiveMaxFileCount > 1
                  ? ` ${effectiveMaxFileCount === Infinity ? "multiple" : effectiveMaxFileCount}
                      files (up to ${formatBytes(maxSize)} each)`
                  : ` a file with ${formatBytes(maxSize)}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {normalizedFiles.length > 0 ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="flex max-h-48 flex-col gap-4">
            {normalizedFiles.map((file, index) => (
              <FileCard
                key={`${file.name}-${file.size}-${index}`}
                file={file}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center gap-2.5">
      <div className="flex flex-1 gap-2.5">
        {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-px">
            <p className="text-foreground/80 line-clamp-1 text-sm font-medium">
              {file.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onRemove}
        >
          <Trash2 className="text-destructive size-4" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string";
}

interface FilePreviewProps {
  file: File & { preview: string };
}

function FilePreview({ file }: FilePreviewProps) {
  if (file.type.startsWith("image/")) {
    return (
      <Image
        src={file.preview}
        alt={file.name}
        width={48}
        height={48}
        loading="lazy"
        className="aspect-square shrink-0 rounded-md object-cover"
      />
    );
  }

  return (
    <FileTextIcon
      className="text-muted-foreground size-10"
      aria-hidden="true"
    />
  );
}
