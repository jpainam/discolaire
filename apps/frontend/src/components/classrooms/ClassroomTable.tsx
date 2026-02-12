"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Download,
  MoreHorizontal,
  Plus,
  Search,
  UserCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, EditIcon, ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { Badge } from "../base-badge";
import { EmptyComponent } from "../EmptyComponent";
import { CreateEditClassroom } from "./CreateEditClassroom";

export function ClassroomTable() {
  const t = useTranslations();

  const [searchParams, setSearchParams] = useQueryStates({
    levelId: parseAsString,
    sectionId: parseAsString,
    cycleId: parseAsString,
  });

  const [queryText, setQueryText] = useState<string>("");
  const debounced = useDebouncedCallback((value: string) => {
    void setQueryText(value);
  }, 300);

  const trpc = useTRPC();

  const { data: classrooms, isPending } = useQuery(
    trpc.classroom.all.queryOptions(),
  );

  const { data: cycles } = useSuspenseQuery(
    trpc.classroomCycle.all.queryOptions(),
  );
  const { data: levels } = useSuspenseQuery(
    trpc.classroomLevel.all.queryOptions(),
  );
  const { data: sections } = useSuspenseQuery(
    trpc.classroomSection.all.queryOptions(),
  );

  const { openSheet } = useSheet();
  const confirm = useConfirm();

  const canDeleteClassroom = useCheckPermission("classroom.delete");
  const canUpdateClassroom = useCheckPermission("classroom.update");

  const queryClient = useQueryClient();

  const deleteClassroomMutation = useMutation(
    trpc.classroom.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.classroom.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!classrooms) return [];

    const { cycleId, levelId, sectionId } = searchParams;
    const q = queryText.toLowerCase();

    return classrooms.filter((c) => {
      if (!c.name.toLowerCase().includes(q)) return false;
      if (cycleId && c.cycleId !== cycleId) return false;
      if (levelId && c.levelId !== levelId) return false;
      if (sectionId && c.sectionId !== sectionId) return false;
      return true;
    });
  }, [classrooms, queryText, searchParams]);

  const canCreateClassroom = useCheckPermission("classroom.create");

  return (
    <div className="">
      <div className="grid grid-cols-1 flex-row justify-between border-b px-4 py-2 lg:flex">
        <Label className="">{t("classrooms")}</Label>
        <div className="grid grid-cols-2 items-center gap-3 md:flex">
          {canCreateClassroom && (
            <Button
              onClick={() => {
                window.open(`/api/pdfs/classroom?format=csv`, "_blank");
              }}
              variant="outline"
            >
              <Download />
              {t("Export")}
            </Button>
          )}
          {canCreateClassroom && (
            <Button
              onClick={() => {
                const formId = `create-classroom-form`;
                openSheet({
                  formId,
                  title: t("create"),
                  description: t("classroom"),
                  view: <CreateEditClassroom formId={formId} />,
                });
              }}
            >
              <Plus />
              {t("add")}
            </Button>
          )}
        </div>
      </div>
      <div className="border-border flex flex-col items-stretch gap-3 border-b p-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-1 items-center gap-2 sm:gap-4">
          <InputGroup>
            <InputGroupInput
              onChange={(e) => debounced(e.target.value)}
              placeholder={t("search")}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {filtered.length} results
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Select
            defaultValue={searchParams.levelId ?? undefined}
            onValueChange={(val) => setSearchParams({ levelId: val })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("levels")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("levels")}</SelectLabel>
                {levels.map((s, index) => (
                  <SelectItem key={index} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            defaultValue={searchParams.sectionId ?? undefined}
            onValueChange={(val) => setSearchParams({ sectionId: val })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("sections")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("sections")}</SelectLabel>
                {sections.map((s, index) => (
                  <SelectItem key={index} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            defaultValue={searchParams.cycleId ?? undefined}
            onValueChange={(val) => setSearchParams({ cycleId: val })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("cycles")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("cycles")}</SelectLabel>
                {cycles.map((s, index) => (
                  <SelectItem key={index} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("effective")}</TableHead>
              <TableHead>{t("boys")}</TableHead>
              <TableHead>{t("girls")}</TableHead>
              <TableHead>{t("head_teacher")}</TableHead>
              <TableHead>{t("level")}</TableHead>
              <TableHead>{t("cycle")}</TableHead>
              <TableHead>{t("section")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`row-${index}`}>
                  {Array.from({ length: 9 }).map((_, ind) => (
                    <TableCell key={`cell-${index}-${ind}`}>
                      <Skeleton className="h-8" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <></>
            )}
            {filtered.map((cl) => {
              const avatar = createAvatar(initials, {
                seed: cl.name,
                fontSize: 35,
              });

              return (
                <TableRow key={cl.id}>
                  <TableCell>
                    <div className="flex flex-row items-center gap-2">
                      <Avatar className="size-5 shrink-0">
                        <AvatarImage
                          src={avatar.toDataUri()}
                          alt={cl.reportName}
                        />
                        <AvatarFallback>
                          {cl.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        className="line-clamp-1 hover:underline"
                        href={`/classrooms/${cl.id}`}
                      >
                        {cl.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="border-border"
                      variant={
                        cl.size > cl.maxSize
                          ? "destructive"
                          : cl.size == cl.maxSize
                            ? "success"
                            : "secondary"
                      }
                      appearance={"outline"}
                    >
                      {cl.size} / {cl.maxSize}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={"info"} appearance={"outline"}>
                      {cl.maleCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={"destructive"} appearance={"outline"}>
                      {cl.femaleCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <Link
                      className="line-clamp-1 overflow-ellipsis hover:underline"
                      href={`/staffs/${cl.headTeacherId}`}
                    >
                      {cl.headTeacher?.lastName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cl.level.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cl.cycle?.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cl.section?.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={"icon-sm"} variant="ghost">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(`/classrooms/${cl.id}`);
                          }}
                        >
                          <ViewIcon />
                          {t("details")}
                        </DropdownMenuItem>
                        {canUpdateClassroom && (
                          <DropdownMenuItem
                            onSelect={() => {
                              const formId = `edit-classroom-form-${cl.id}`;
                              openSheet({
                                formId,
                                description: cl.name,
                                title: t("edit"),
                                view: (
                                  <CreateEditClassroom
                                    formId={formId}
                                    classroom={cl}
                                  />
                                ),
                              });
                            }}
                          >
                            <EditIcon />
                            {t("edit")}
                          </DropdownMenuItem>
                        )}
                        {canDeleteClassroom && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={!canDeleteClassroom}
                              variant="destructive"
                              onSelect={async () => {
                                await confirm({
                                  title: t("delete"),
                                  description: t("delete_confirmation"),

                                  onConfirm: async () => {
                                    await deleteClassroomMutation.mutateAsync(
                                      cl.id,
                                    );
                                  },
                                });
                              }}
                            >
                              <DeleteIcon />
                              {t("delete")}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}

            {classrooms?.length == 0 && !isPending && (
              <TableRow>
                <TableCell colSpan={9}>
                  <EmptyComponent
                    icon={<UserCircle />}
                    title="Aucune classes"
                    description="Commencer par creer des classes ou devenez parent d'eleves"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
