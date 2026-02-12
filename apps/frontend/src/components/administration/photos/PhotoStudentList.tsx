"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";

import { handleDeleteAvatar } from "~/actions/upload";
import { PhotoDetails } from "~/components/administration/photos/PhotoDetails";
import { PhotoStudentHeader } from "~/components/administration/photos/PhotoStudentHeader";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "-";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export function PhotoStudentList() {
  const t = useTranslations();
  const [searchQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [startAfter, setStartAfter] = useQueryState(
    "startAfter",
    parseAsString.withDefault(""),
  );

  const [pageIndex, setPageIndex] = useQueryState(
    "pageIndex",
    parseAsInteger.withDefault(1),
  );
  const trpc = useTRPC();
  const studentPhotoQuery = useQuery(
    trpc.photo.students.queryOptions({
      q: searchQuery,
      pageIndex: pageIndex,
      startAfter: startAfter,
    }),
  );
  const photos = studentPhotoQuery.data ?? [];
  const nextPage = () => {
    const lastImage = photos[photos.length - 1];
    if (!lastImage?.name) return;
    void setStartAfter(lastImage.name);
    void setPageIndex(() => pageIndex + 1);
  };
  const previousPage = () => {
    const firstImage = photos[0];
    if (!firstImage?.name) return;
    void setStartAfter(firstImage.name);
    void setPageIndex(() => pageIndex - 1);
  };

  // const { data: photos } = useSuspenseQuery(
  //   trpc.photo.listObjects.queryOptions({
  //     prefix: "student/",
  //     bucket,
  //   }),
  // );

  const locale = useLocale();

  const { openSheet } = useSheet();
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const deletePhoto = async (key: string) => {
    toast.loading(t("deleting"), { id: 0 });
    const result = await handleDeleteAvatar(key, "student");
    if (result.success) {
      await queryClient.invalidateQueries(trpc.photo.pathFilter());
      toast.success(t("deleted_successfully"), { id: 0 });
    } else {
      toast.error("Une erreur s'est produite", { id: 0 });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <PhotoStudentHeader />
      <div className="flex flex-col gap-2 px-4">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("fullName")}</TableHead>
                <TableHead>{t("registrationNumber")}</TableHead>
                <TableHead>{t("classroom")}</TableHead>
                <TableHead className="text-center">URL</TableHead>

                <TableHead>Taille</TableHead>
                <TableHead>{t("Modified")}</TableHead>

                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentPhotoQuery.isPending ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <TableSkeleton rows={10} cols={6} />
                  </TableCell>
                </TableRow>
              ) : (
                studentPhotoQuery.data?.map((p, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            className="hover:underline"
                            href={`/students/${p.id}`}
                          >
                            {getFullName(p)}
                          </Link>
                          <Button
                            variant={"secondary"}
                            onClick={() => {
                              if (!p.key) {
                                toast.warning(`Nom du fichier non trouvé`);
                                return;
                              }
                              openSheet({
                                title: getFullName(p),
                                description: `Photo ${t("student")} - ${p.registrationNumber}`,
                                view: <PhotoDetails fileName={p.key} />,
                              });
                            }}
                            size={"xs"}
                          >
                            {t("details")}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.registrationNumber}
                      </TableCell>
                      <TableCell>
                        <Link
                          className="text-muted-foreground hover:underline"
                          href={`/classrooms/${p.classroom?.id}`}
                        >
                          {p.classroom?.reportName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant={"link"} size={"sm"}>
                          ... {p.key?.slice(-10)}
                        </Button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.size ? formatFileSize(p.size) : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.lastModified?.toLocaleDateString(locale, {
                          month: "short",
                          year: "numeric",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} size={"icon-sm"}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                if (!p.key) {
                                  toast.warning(`Nom du fichier non trouvé`);
                                  return;
                                }
                                openSheet({
                                  title: getFullName(p),
                                  description: `Photo ${t("student")} - ${p.registrationNumber}`,
                                  view: <PhotoDetails fileName={p.key} />,
                                });
                              }}
                            >
                              <ViewIcon />
                              {t("details")}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={async () => {
                                if (!p.key) {
                                  toast.warning(`Nom du fichier non trouvé`);
                                  return;
                                }
                                await confirm({
                                  title: t("delete"),
                                  description: t("delete_confirmation"),

                                  onConfirm: async () => {
                                    if (p.key) {
                                      await deletePhoto(p.key);
                                    }
                                  },
                                });
                              }}
                              variant="destructive"
                            >
                              <DeleteIcon />
                              {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem aria-disabled={true}>
              <PaginationPrevious
                tabIndex={pageIndex <= 1 ? -1 : undefined}
                className={
                  pageIndex <= 1 ? "pointer-events-none opacity-50" : undefined
                }
                aria-disabled={pageIndex <= 1}
                onClick={() => {
                  void previousPage();
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                isActive={pageIndex == 1}
                onClick={() => {
                  void setPageIndex(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  void setPageIndex(2);
                }}
                isActive={pageIndex == 2}
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                isActive={pageIndex == 9}
                onClick={() => {
                  void setPageIndex(9);
                }}
              >
                9
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  void setPageIndex(10);
                }}
                isActive={pageIndex == 10}
              >
                10
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  void nextPage();
                }}
                //href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
