"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditScheduleDivision } from "./CreateEditScheduleDivision";

const DAYS_OF_WEEK = [
  { key: "lundi", label: "Lundi" },
  { key: "mardi", label: "Mardi" },
  { key: "mercredi", label: "Mercredi" },
  { key: "jeudi", label: "Jeudi" },
  { key: "vendredi", label: "Vendredi" },
  { key: "samedi", label: "Samedi" },
];

export function ScheduleDivision() {
  const trpc = useTRPC();
  const { data: schedules } = useSuspenseQuery(
    trpc.scheduleDivision.all.queryOptions(),
  );
  const queryClient = useQueryClient();
  const deleteScheduleMutation = useMutation(
    trpc.scheduleDivision.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.scheduleDivision.pathFilter());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const { openModal } = useModal();
  const confirm = useConfirm();
  const t = useTranslations();
  return (
    <div className="w-full space-y-6">
      {/* Time Slots List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Créneaux Horaires</CardTitle>
          <Button
            onClick={() => {
              openModal({
                title: "Ajouter un Créneau",
                view: <CreateEditScheduleDivision />,
              });
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((slot) => (
              <div
                key={slot.id}
                className="bg-card flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-4">
                    <span className="font-medium">
                      Début:{" "}
                      {slot.startTime.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="font-medium">
                      Fin:{" "}
                      {slot.endTime.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      slot.monday,
                      slot.tuesday,
                      slot.wednesday,
                      slot.thursday,
                      slot.friday,
                      slot.saturday,
                      slot.sunday,
                    ].map((day, index) => (
                      <Badge
                        key={index}
                        variant={day ? "default" : "secondary"}
                      >
                        {DAYS_OF_WEEK[index]?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      openModal({
                        title: "Modifier le Créneau",
                        view: <CreateEditScheduleDivision slot={slot} />,
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const isConfirmed = await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),
                      });
                      if (isConfirmed) {
                        toast.loading(t("deleting"));
                        deleteScheduleMutation.mutate(slot.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
