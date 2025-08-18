/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Plus, Search, Users, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import { cn } from "@repo/ui/lib/utils";

import CreateEditContact from "~/components/contacts/CreateEditContact";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { useStudentStore } from "./store";

export function Step4() {
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
  const parentSearchQuery = useQuery(
    trpc.contact.search.queryOptions({ query }),
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Parents/Guardians Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Existing Parents</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search by name or phone number..."
                value={query}
                onChange={(e) => debounce(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto rounded-lg border">
            {parentSearchQuery.data && parentSearchQuery.data.length > 0 ? (
              parentSearchQuery.data.map((parent) => (
                <div
                  key={parent.id}
                  className="flex items-center justify-between border-b p-3 last:border-b-0 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">
                      {parent.prefix} {getFullName(parent)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {parent.phoneNumber1} • {parent.occupation}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      // if (!selectedParents.find((p) => p.id === parent.id)) {
                      //   addParent(parent);
                      // }
                      // setParentSearchQuery("");
                    }}
                    //disabled={selectedParents.some((p) => p.id === parent.id)}
                  >
                    {/* {selectedParents.some((p) => p.id === parent.id)
                        ? "Added"
                        : "Add"} */}
                    Added
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No parents found matching your search.
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add New Parent/Guardian</h3>
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
            Add New Parent
          </Button>
        </div>

        {selectedParents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Selected Parents/Guardians
            </h3>
            <div className="space-y-3">
              {selectedParents.map((parent) => (
                <div
                  key={parent.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {parent.civility} {parent.firstName} {parent.lastName}
                      </p>
                      <Badge
                        variant={
                          parent.emergencyContact ? "default" : "secondary"
                        }
                      >
                        {parent.relationship}
                      </Badge>
                      {parent.emergencyContact && (
                        <Badge variant="destructive">Emergency Contact</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {parent.phone1} •{" "}
                      {parent.occupation ?? "No occupation listed"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParent("parent.id")}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedParents.length === 0 && (
          <Alert
            className={cn(
              "border-amber-500/50 bg-amber-500/10 text-amber-600",
              "dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
            )}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please add at least one parent or guardian before proceeding.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
