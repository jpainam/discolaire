"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { AvatarState } from "~/components/AvatarState";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { EmptyComponent } from "../EmptyComponent";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";

export function AddStudentToParent({ contactId }: { contactId: string }) {
  const trpc = useTRPC();
  const t = useTranslations();
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const addStudentToContactMutation = useMutation(
    trpc.studentContact.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [queryText, setQueryText] = useState<string>("");
  const { data: students, isPending } = useQuery(
    trpc.student.all.queryOptions({
      query: queryText,
    }),
  );
  const debounce = useDebouncedCallback((value: string) => {
    void setQueryText(value);
  }, 300);
  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupInput
          placeholder={t("search")}
          onChange={(e) => debounce(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <ScrollArea className="h-[300px]">
        <div className="flex flex-col gap-2 pr-4">
          {isPending ? (
            <div className="gap- grid grid-cols-1">
              {Array.from({ length: 20 }).map((_, t) => (
                <Skeleton className="h-8" key={t} />
              ))}
            </div>
          ) : students?.length == 0 ? (
            <EmptyComponent
              title="Aucun élève"
              description="Veuillez affiner votre recherche"
            />
          ) : (
            students?.map((stud) => {
              return (
                <Item
                  className="p-1"
                  variant={studentIds.includes(stud.id) ? "muted" : "default"}
                  key={stud.id}
                  onClick={() => {
                    if (studentIds.includes(stud.id)) {
                      setStudentIds(
                        studentIds.filter((studId) => studId != stud.id),
                      );
                    } else {
                      setStudentIds([...studentIds, stud.id]);
                    }
                  }}
                >
                  <ItemMedia>
                    <AvatarState
                      className="size-8"
                      name={getFullName(stud)}
                      avatar={stud.avatar}
                      avatarBasePath="/api/avatars"
                      zoomable={false}
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{getFullName(stud)}</ItemTitle>
                    <ItemDescription>{stud.classroom?.name}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {studentIds.includes(stud.id) && (
                      <CheckIcon className="size-4 text-green-600" />
                    )}
                  </ItemActions>
                </Item>
              );
            })
          )}
        </div>
      </ScrollArea>
      <div className="flex items-center justify-end gap-2">
        <div className="text-muted-foreground flex-1 text-xs">
          {studentIds.length} séléctionné(s)
        </div>
        <Button
          variant={"secondary"}
          onClick={() => {
            closeModal();
          }}
        >
          {t("close")}
        </Button>
        <Button
          disabled={addStudentToContactMutation.isPending}
          onClick={() => {
            addStudentToContactMutation.mutate(
              studentIds.map((studId) => {
                return {
                  studentId: studId,
                  contactId,
                };
              }),
            );
          }}
        >
          {addStudentToContactMutation.isPending && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
