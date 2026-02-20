"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import {
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  useQueryState,
} from "nuqs";
import { toast } from "sonner";

import { handleDeleteAvatar } from "~/actions/upload";
import { PhotoDetails } from "~/components/administration/photos/PhotoDetails";
import { PhotoListHeader } from "~/components/administration/photos/PhotoListHeader";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
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
import { UserLink } from "~/components/UserLink";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, MoreIcon } from "~/icons";
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

export function PhotoContactList() {
  const t = useTranslations();
  const [searchQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [dateFrom] = useQueryState("dateFrom", parseAsIsoDate);
  const [dateTo] = useQueryState("dateTo", parseAsIsoDate);
  const [pageIndex, setPageIndex] = useQueryState(
    "pageIndex",
    parseAsInteger.withDefault(1),
  );
  const trpc = useTRPC();
  const { data: photos, isFetching } = useQuery(
    trpc.photo.contacts.queryOptions({
      q: searchQuery || undefined,
      dateFrom: dateFrom?.toISOString().split("T")[0],
      dateTo: dateTo?.toISOString().split("T")[0],
      pageIndex,
    }),
  );

  const locale = useLocale();
  const { openSheet } = useSheet();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const openDetails = (p: NonNullable<typeof photos>[number]) => {
    if (!p.key) {
      toast.warning(`Nom du fichier non trouvé`);
      return;
    }
    openSheet({
      title: getFullName(p),
      description: `Photo ${t("contact")}`,
      view: <PhotoDetails fileName={p.key} />,
    });
  };

  const deletePhoto = async (key: string) => {
    toast.loading(t("deleting"), { id: 0 });
    const result = await handleDeleteAvatar(key, "contact");
    if (result.success) {
      await queryClient.invalidateQueries(trpc.photo.pathFilter());
      toast.success(t("deleted_successfully"), { id: 0 });
    } else {
      toast.error("Une erreur s'est produite", { id: 0 });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <PhotoListHeader entityType="contact" showClassroomFilter={false} />
      <div className="flex flex-col gap-2 px-4">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("fullName")}</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>{t("Modified")}</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching && photos?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <TableSkeleton rows={10} cols={4} />
                  </TableCell>
                </TableRow>
              ) : photos?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-10 text-center"
                  >
                    {t("no_results")}
                  </TableCell>
                </TableRow>
              ) : (
                photos?.map((p, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer"
                    onClick={() => openDetails(p)}
                  >
                    <TableCell>
                      <UserLink
                        href={`/contacts/${p.id}`}
                        id={p.id}
                        avatar={p.location}
                        profile="contact"
                        name={getFullName(p)}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.occupation ?? "-"}
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
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} size={"icon-sm"}>
                            <MoreIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                                  if (p.key) await deletePhoto(p.key);
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                tabIndex={pageIndex <= 1 ? -1 : undefined}
                className={
                  pageIndex <= 1 ? "pointer-events-none opacity-50" : undefined
                }
                aria-disabled={pageIndex <= 1}
                onClick={() => void setPageIndex(pageIndex - 1)}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-muted-foreground px-4 text-sm">
                {t("page")} {pageIndex}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className={
                  (photos ?? []).length < 20
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                aria-disabled={(photos ?? []).length < 20}
                onClick={() => void setPageIndex(pageIndex + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
