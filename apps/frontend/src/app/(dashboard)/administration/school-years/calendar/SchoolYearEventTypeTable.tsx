"use client";
import { Button } from "@repo/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { PencilIcon, PlusIcon, Trash } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "~/components/EmptyState";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditSchoolYearEventType } from "./CreateEditSchoolYearEventType";
export function SchoolYearEventTypeTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: eventTypes } = useSuspenseQuery(
    trpc.schoolYearEvent.eventTypes.queryOptions(),
  );
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const deleteMutation = useMutation(
    trpc.schoolYearEvent.deleteEventType.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.schoolYearEvent.pathFilter());
        toast.success(t("Success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openModal } = useModal();
  return (
    <div className="px-4 flex flex-col gap-4">
      <div className="justify-end flex flex-row">
        <Button
          onClick={() => {
            openModal({
              title: t("Add Event Type"),
              view: <CreateEditSchoolYearEventType />,
            });
          }}
          size={"sm"}
        >
          <PlusIcon className="w-4 h-4" />
          {t("add")}
        </Button>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("Label")}</TableHead>
              <TableHead>{t("Color")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventTypes.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <EmptyState className="my-8" title={t("no_data")} />
                </TableCell>
              </TableRow>
            )}
            {eventTypes.map((eventType) => {
              return (
                <TableRow>
                  <TableCell>{eventType.name}</TableCell>
                  <TableCell>
                    <div
                      style={{
                        backgroundColor: eventType.color,
                        width: "1rem",
                        height: "1rem",
                        borderRadius: "50%",
                      }}
                    ></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-row items-center justify-end gap-1">
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        className="size-8"
                        onClick={() => {
                          openModal({
                            title: t("Edit Event Type"),
                            view: (
                              <CreateEditSchoolYearEventType
                                id={eventType.id}
                                name={eventType.name}
                                color={eventType.color}
                              />
                            ),
                          });
                        }}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        className="size-8"
                        onClick={async () => {
                          const isConfirmed = await confirm({
                            title: t("Are you sure?"),
                            description: t(
                              "Are you sure you want to delete this event type?",
                            ),
                          });
                          if (isConfirmed) {
                            toast.loading(t("loading"), { id: 0 });
                            deleteMutation.mutate(eventType.id);
                          }
                        }}
                      >
                        <Trash className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
