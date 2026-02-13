"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { AvatarState } from "~/components/AvatarState";
import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function AddToParentToStudent({ studentId }: { studentId: string }) {
  const trpc = useTRPC();
  const t = useTranslations();
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const addContactToStudentMutation = useMutation(
    trpc.studentContact.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.students.pathFilter());
        await queryClient.invalidateQueries(trpc.student.contacts.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const [contactIds, setContactIds] = useState<string[]>([]);
  const [queryText, setQueryText] = useState<string>("");
  const { data: contacts, isPending } = useQuery(
    trpc.contact.all.queryOptions({
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
          ) : contacts?.length == 0 ? (
            <EmptyComponent
              title="Aucun contact"
              description="Veuillez affiner votre recherche"
            />
          ) : (
            contacts?.map((contact) => {
              return (
                <Item
                  className="p-1"
                  variant={
                    contactIds.includes(contact.id) ? "muted" : "default"
                  }
                  key={contact.id}
                  onClick={() => {
                    if (contactIds.includes(contact.id)) {
                      setContactIds(
                        contactIds.filter((contId) => contId != contact.id),
                      );
                    } else {
                      setContactIds([...contactIds, contact.id]);
                    }
                  }}
                >
                  <ItemMedia>
                    <AvatarState
                      className="size-8"
                      name={getFullName(contact)}
                      avatar={contact.avatar}
                      avatarBasePath="/api/avatars"
                      zoomable={false}
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{getFullName(contact)}</ItemTitle>
                    <ItemDescription>
                      {contact.occupation ?? contact.address}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {contactIds.includes(contact.id) && (
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
          {contactIds.length} séléctionné(s)
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
          disabled={addContactToStudentMutation.isPending}
          onClick={() => {
            addContactToStudentMutation.mutate(
              contactIds.map((contId) => {
                return {
                  studentId: studentId,
                  contactId: contId,
                };
              }),
            );
          }}
        >
          {addContactToStudentMutation.isPending && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
