"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
const schema = z.object({
  name: z.string().min(1),
  typeId: z.string().min(1),
  date: z.coerce.date(),
});
export function CreateEditSchoolYearEvent({
  event,
}: {
  event?: RouterOutputs["schoolYearEvent"]["all"][number];
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: event?.name ?? "",
      date: event?.date ?? new Date(),
      typeId: event?.typeId ?? "",
    },
  });

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { closeModal } = useModal();
  const createEventMutation = useMutation(
    trpc.schoolYearEvent.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.schoolYearEvent.all.pathFilter(),
        );
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateEventMutation = useMutation(
    trpc.schoolYearEvent.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.schoolYearEvent.all.pathFilter(),
        );
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  // Add new event
  const handleAddEvent = (data: z.infer<typeof schema>) => {
    const values = {
      name: data.name,
      typeId: data.typeId,
      date: data.date,
    };
    if (event) {
      updateEventMutation.mutate({
        ...values,
        id: event.id,
      });
    } else {
      createEventMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddEvent)}>
        <div>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-name">Event Name</Label>
              <Input
                id="event-name"

                // value={newEvent.name}
                // onChange={(e) =>
                //   setNewEvent({ ...newEvent, name: e.target.value })
                // }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                type="date"
                // value={newEvent.date}
                // onChange={(e) =>
                //   setNewEvent({ ...newEvent, date: e.target.value })
                // }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select
              // value={newEvent.type}
              // onValueChange={(value) =>
              //   setNewEvent({ ...newEvent, type: value })
              // }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {/* {Object.entries(EVENT_TYPES).map(([type, { label }]) => (
                    <SelectItem key={type} value={type}>
                      {label}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Button>Add Event</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
