/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Users, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";

import CreateEditContact from "~/components/contacts/CreateEditContact";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { useStudentStore } from "./store";

export function Step3() {
  const trpc = useTRPC();
  const [query, setQuery] = useState("");
  const {
    currentStep,
    studentData,
    selectedParents,
    setCurrentStep,
    updateStudentData,
    addParent,
    removeParent,
    markStepComplete,
    isStepComplete,
    canProceedToStep,
    resetForm,
  } = useStudentStore();
  const debounce = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 300);
  const { openSheet } = useSheet();
  const parentSearchQuery = useQuery(trpc.contact.all.queryOptions({ query }));
  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex items-center gap-2">
          <Users className="h-4 w-4" />
          {t("Parents Guardians")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder={t("search")}
            value={query}
            onChange={(e) => debounce(e.target.value)}
            className="pl-10"
          />
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
                  size="sm"
                  variant={"default"}
                  onClick={() => {
                    if (!selectedParents.find((p) => p.id === parent.id)) {
                      addParent({
                        parentId: parent.id,
                        name: `${parent.prefix} ${getFullName(parent)}`,
                      });
                    }
                    setQuery("");
                  }}
                  disabled={selectedParents.some((p) => p.id === parent.id)}
                >
                  {selectedParents.some((p) => p.id === parent.id)
                    ? t("Added")
                    : t("add")}
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

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{}</h3>
          <Button
            onClick={() => {
              openSheet({
                view: <CreateEditContact />,
              });
            }}
            type="button"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("Add a parent")}
          </Button>
        </div>

        {selectedParents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("selected")}</h3>
            <div className="space-y-3">
              {selectedParents.map((parent) => (
                <div
                  key={parent.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{parent.name}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    className="size-7"
                    size="sm"
                    onClick={() => removeParent(parent.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
