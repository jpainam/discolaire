"use client";

import { useState } from "react";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, Users, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { EmptyComponent } from "~/components/EmptyComponent";
import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { CreateParent } from "./CreateParent";
import { useStudentFormContext } from "./StudentFormContext";

export function ParentsStep() {
  const trpc = useTRPC();
  const t = useTranslations();
  const { openModal } = useModal();
  const { data: relationships, isPending: relationshipIsPending } = useQuery(
    trpc.contactRelationship.all.queryOptions(),
  );
  const { selectedParents, setSelectedParents, removeParent } =
    useStudentFormContext();

  const [query, setQuery] = useState("");
  const [relationshipId, setRelationshipId] = useState<string | null>(null);
  const debounce = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 200);

  const { data: parents, isPending } = useQuery(
    trpc.contact.all.queryOptions({ query, limit: 10 }),
  );

  const handleAddParent = (parent: {
    id: string;
    name: string;
    relationshipId?: string | null;
  }) => {
    const resolvedRelationshipId =
      parent.relationshipId ?? relationshipId ?? "";
    setSelectedParents([...selectedParents]);
    const existingIndex = selectedParents.findIndex(
      (item) => item.id === parent.id,
    );
    const nextParent = { ...parent, relationshipId: resolvedRelationshipId };

    if (existingIndex >= 0) {
      const next = [...selectedParents];
      next[existingIndex] = nextParent;
      setSelectedParents(next);
    } else {
      setSelectedParents([...selectedParents, nextParent]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("Parents Guardians")}
          </CardTitle>
          <CardDescription>
            Veuillez rechercher si le parent existe avant d'ajouter
          </CardDescription>
          <CardAction>
            <Button
              onClick={() => {
                openModal({
                  className: "sm:max-w-xl",
                  title: t("add"),
                  description: "Nouveau parent/contact",
                  view: (
                    <CreateParent
                      setParentIdAction={(id, name, relationship) => {
                        handleAddParent({
                          id,
                          name,
                          relationshipId: relationship,
                        });
                      }}
                    />
                  ),
                });
              }}
              variant={"secondary"}
              type="button"
            >
              {t("new")}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <InputGroup>
              <InputGroupInput
                placeholder={t("search")}
                value={query}
                onChange={(e) => debounce(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>

            {relationshipIsPending ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <RelationshipSelector
                className="w-full"
                defaultValue={relationshipId}
                onChange={(val) => {
                  setRelationshipId(val);
                }}
              />
            )}
            <div className="flex items-center justify-end"></div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="max-h-[500px] overflow-y-auto rounded-lg border">
              {isPending ? (
                <div className="grid grid-cols-1 gap-4 px-4 py-2">
                  {Array.from({ length: 15 }).map((_, t) => (
                    <Skeleton className="h-8" key={t} />
                  ))}
                </div>
              ) : parents?.length == 0 ? (
                <EmptyComponent
                  title="Ajouter parents/contacts"
                  description="Veuillez rechercher le parent à ajouter"
                />
              ) : null}
              {parents?.map((parent) => {
                const avatar = createAvatar(initials, {
                  seed: getFullName(parent),
                });
                return (
                  <div
                    key={parent.id}
                    className="hover:bg-muted/50 flex items-center justify-between border-b p-2 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={
                            parent.avatar
                              ? `/api/avatars/${parent.avatar}`
                              : avatar.toDataUri()
                          }
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-2">
                        <Label>
                          {parent.prefix} {getFullName(parent)}
                        </Label>
                        <span className="text-muted-foreground text-xs">
                          {parent.phoneNumber1} • {parent.occupation}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size={"xs"}
                      variant="outline"
                      onClick={() => {
                        if (!relationshipId) {
                          toast.warning(
                            "Veuillez sélectionner le type de relation",
                          );
                          return;
                        }
                        handleAddParent({
                          id: parent.id,
                          name: getFullName(parent),
                          relationshipId: relationshipId,
                        });
                      }}
                    >
                      Sélectionner
                      <ArrowRight />
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="max-h-[500px] overflow-y-auto rounded-lg border">
              {selectedParents.map((p, index) => {
                return (
                  <div
                    key={index}
                    className="hover:bg-muted/50 flex items-center justify-between border-b p-2 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <Label>{p.name}</Label>
                      <span className="text-muted-foreground text-xs">
                        {
                          relationships?.find(
                            (r) => r.id.toString() == p.relationshipId,
                          )?.name
                        }
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        removeParent(p.id);
                      }}
                    >
                      <XIcon className="text-destructive" />
                    </Button>
                  </div>
                );
              })}
              {selectedParents.length == 0 && (
                <EmptyComponent
                  title="Séléctionner à gauche"
                  description="Commencer par sélectionner les parent à ajouter à l'élève"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
