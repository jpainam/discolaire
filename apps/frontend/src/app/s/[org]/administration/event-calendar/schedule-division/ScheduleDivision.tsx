"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditScheduleDivision } from "./CreateEditScheduleDivision";
import { ScheduleDivisionHeader } from "./ScheduleDivisionHeader";

const DAYS_OF_WEEK = [
  { key: "lundi", label: "Lundi" },
  { key: "mardi", label: "Mardi" },
  { key: "mercredi", label: "Mercredi" },
  { key: "jeudi", label: "Jeudi" },
  { key: "vendredi", label: "Vendredi" },
  { key: "samedi", label: "Samedi" },
  { key: "dimanche", label: "Dimanche" },
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
    <div className="flex flex-col gap-4">
      <ScheduleDivisionHeader />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {schedules.map((slot) => (
          <Card key={slot.id} className="gap-2 shadow-sm">
            <CardHeader>
              <CardTitle>
                <span>{slot.name}</span>
              </CardTitle>
              <CardDescription className="gap-4">
                <span>
                  {slot.startTime.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {" - "}
                <span>
                  {slot.endTime.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </CardDescription>

              <CardAction className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    openModal({
                      title: "Modifier le Créneau",
                      view: <CreateEditScheduleDivision slot={slot} />,
                    });
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
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
              </CardAction>
            </CardHeader>
            <CardContent>
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
                  <Badge key={index} variant={day ? "default" : "secondary"}>
                    {DAYS_OF_WEEK[index]?.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
