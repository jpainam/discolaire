"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import {
  AlertCircleIcon,
  ArrowRightLeft,
  DownloadIcon,
  ImageIcon,
  MoreVertical,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import { StudentSearchDialog } from "~/components/students/StudentSearchDialog";
import { formatBytes, useFileUpload } from "~/hooks/use-file-upload";
import { useModal } from "~/hooks/use-modal";
import { breadcrumbAtom } from "~/lib/atoms";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFileIcon } from "./photo-utils";

const getFilePreview = ({
  file,
  url,
  type,
  name,
}: {
  file?: File;
  url?: string;
  type: string;
  name: string;
}) => {
  const fileType = type;
  const fileName = name;

  const renderImage = (src: string) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={fileName}
      className="size-full rounded-t-[inherit] object-cover"
    />
  );

  return (
    <div className="bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]">
      {fileType.startsWith("image/") ? (
        file ? (
          (() => {
            const previewUrl = URL.createObjectURL(file);
            return renderImage(previewUrl);
          })()
        ) : url ? (
          renderImage(url)
        ) : (
          <ImageIcon className="size-5 opacity-60" />
        )
      ) : (
        getFileIcon({ type, name })
      )}
    </div>
  );
};

export function ImageGrid({
  bucket,
  prefix = "student/",
}: {
  bucket: string;
  prefix: string;
}) {
  const trpc = useTRPC();
  const [startAfter, setStartAfter] = useState<string | undefined>(undefined);

  // const usersQuery = useQueries({
  //   queries: ids.map((id) => ({
  //     queryKey: ["data", id],
  //     queryFn: () => fetchDataById(id),
  //   })),
  // });

  const { data: images } = useSuspenseQuery(
    trpc.photo.listObjects.queryOptions({
      prefix: prefix,
      bucket: bucket,
      startAfter: startAfter,
    }),
  );

  const t = useTranslations();
  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  const pathname = usePathname();
  useEffect(() => {
    const d = [
      {
        name: t("Administration"),
        url: "/administration",
      },
      {
        name: t("Photos"),
        url: "/administration/photos",
      },
    ];
    if (pathname.includes("students")) {
      d.push({
        name: t("Student photos"),
        url: "/administration/photos/students",
      });
    } else if (pathname.includes("staff")) {
      d.push({
        name: t("Staff photos"),
        url: "/administration/photos/staffs",
      });
    } else {
      d.push({
        name: t("Contact photos"),
        url: "/administration/photos/contacts",
      });
    }
    setBreadcrumbs(d);
  }, [pathname, setBreadcrumbs, t]);

  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
  const maxFiles = 6;
  const confirm = useConfirm();

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    initialFiles: images.map((image) => ({
      name: image.name,
      size: image.size,
      type: image.mime,
      url: image.location,
      id: image.key,
    })),
  });
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  const handleDeleteAvatar = async (userId: string) => {
    toast.loading(t("deleting"), { id: 0 });
    const response = await fetch("/api/upload/avatars", {
      method: "DELETE",
      body: JSON.stringify({
        userId: userId,
      }),
    });
    if (response.ok) {
      toast.success(t("deleted_successfully"), {
        id: 0,
      });
      await queryClient.invalidateQueries(trpc.user.get.pathFilter());
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { error } = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      toast.error(error ?? response.statusText, { id: 0 });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Files ({files.length})
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={openFileDialog}>
                  <UploadIcon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Add files
                </Button>
                <Button variant="outline" size="sm" onClick={clearFiles}>
                  <Trash2Icon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Remove all
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="bg-background relative flex flex-col rounded-md border"
                >
                  {getFilePreview({
                    url: `/api/download/avatars/${image.key}`,
                    type: image.mime,
                    name: image.name,
                  })}
                  <Button
                    onClick={() => removeFile(image.name)}
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove image"
                  >
                    <XIcon className="size-3.5" />
                  </Button>

                  <div className="flex flex-row items-center gap-1">
                    <div className="flex min-w-0 flex-col gap-0.5 border-t px-1">
                      <p className="truncate text-[13px] font-medium">
                        {image.name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {formatBytes(image.size)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className="size-6"
                          size={"icon"}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onSelect={() => {
                            openModal({
                              title: t("Search"),
                              view: (
                                <StudentSearchDialog
                                  onSelect={(val) => {
                                    console.log(val);
                                  }}
                                />
                              ),
                            });
                          }}
                        >
                          <ArrowRightLeft />
                          {t("Re-assign")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DownloadIcon />
                          {t("download")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={async () => {
                            const isConfirmed = await confirm({
                              title: t("Are you sure?"),
                              description: t("This action cannot be undone."),
                            });
                            if (isConfirmed) {
                              const userId = extractId(image.key);
                              if (!userId) return;
                              alert(userId);
                              void handleDeleteAvatar(userId);
                            }
                          }}
                          variant="destructive"
                        >
                          <Trash2Icon />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your files here</p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} files ∙ Up to {maxSizeMB}MB
            </p>
            <Button variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select images
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {files.length >= 0 && (
        <Button
          size={"sm"}
          className="w-fit self-center"
          onClick={() => {
            const lastImage = images[images.length - 1];
            if (!lastImage) return;
            setStartAfter(lastImage.name);
          }}
        >
          {t("Load more")}
        </Button>
      )}
    </div>
  );
}

function extractId(path: string): string | null {
  const filename = path.split("/").pop();
  if (!filename) return null;
  return filename.split(".").slice(0, -1).join(".") || null;
}
