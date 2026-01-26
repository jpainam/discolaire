"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";



import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { CreateParent } from "./CreateParent";
import { useStudentFormContext } from "./StudentFormContext";
import { parentsSchema } from "./validation";


export function ParentsStep({ onNextAction }: { onNextAction: () => void }) {
  const trpc = useTRPC();
  const t = useTranslations();
  const { openModal } = useModal();
  const { selectedParents, setSelectedParents } = useStudentFormContext();

  const [query, setQuery] = useState("");
  const [relationshipId, setRelationshipId] = useState<string | null>(null);
  const debounce = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 300);

  const parentSearchQuery = useQuery(trpc.contact.all.queryOptions({ query }));

  const form = useForm({
    defaultValues: { selectedParents },
    validators: { onSubmit: parentsSchema },
    onSubmit: ({ value }) => {
      setSelectedParents(value.selectedParents);
      onNextAction();
    },
  });

  const handleAddParent = (parent: {
    id: string;
    name: string;
    relationshipId: string;
  }) => {
    const nextParents = selectedParents.some((item) => item.id === parent.id)
      ? selectedParents
      : [...selectedParents, parent];

    setSelectedParents(nextParents);
    form.setFieldValue("selectedParents", nextParents);
  };

  return (
    <form
      id="student-parents-form"
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("Parents Guardians")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder={t("search")}
                value={query}
                onChange={(e) => debounce(e.target.value)}
                className="pl-10"
              />
            </div>
            <RelationshipSelector
              defaultValue={relationshipId}
              onChange={(val) => {
                setRelationshipId(val);
              }}
            />
            <Button
              onClick={() => {
                openModal({
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
              type="button"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("add")}
            </Button>
          </div>

          <div className="max-h-48 overflow-y-auto rounded-lg border">
            {parentSearchQuery.data && parentSearchQuery.data.length > 0 ? (
              parentSearchQuery.data.map((parent) => (
                <div
                  key={parent.id}
                  className="hover:bg-primary/40 hover:text-primary-foreground flex items-center justify-between border-b p-3 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {parent.prefix} {getFullName(parent)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {parent.phoneNumber1} • {parent.occupation}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => {
                      handleAddParent({
                        id: parent.id,
                        name: getFullName(parent),
                        relationshipId: relationshipId ?? "",
                      });
                    }}
                  >
                    {t("add")}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground p-4 text-center">
                {t("no_data")}
              </div>
            )}
          </div>

          <Separator />
        </CardContent>
      </Card>
    </form>
  );
}