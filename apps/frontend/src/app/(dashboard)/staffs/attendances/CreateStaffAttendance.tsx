"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { z } from "zod";

import { DatePicker } from "~/components/DatePicker";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";

const statusValues = [
  "present",
  "absent",
  "late",
  "holiday",
  "mission",
] as const;

const formSchema = z
  .object({
    staffId: z.string().min(1),
    date: z.date(),
    startDate: z.date(),
    endDate: z.date(),
    status: z.enum(statusValues),
    observation: z.string().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

const statusOptions = [
  { label: "Présent", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Retard", value: "late" },
  { label: "Congé", value: "holiday" },
  { label: "Mission", value: "mission" },
] as const;

const formatDateTimeLocal = (value?: Date) => {
  if (!value) {
    return "";
  }
  const pad = (val: number) => String(val).padStart(2, "0");
  return [
    value.getFullYear(),
    "-",
    pad(value.getMonth() + 1),
    "-",
    pad(value.getDate()),
    "T",
    pad(value.getHours()),
    ":",
    pad(value.getMinutes()),
  ].join("");
};

const parseDateTimeLocal = (value: string) => {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export function CreateStaffAttendance() {
  const t = useTranslations();
  const [staffId, setStaffId] = useQueryState("staffId");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const today = useMemo(() => new Date(), []);

  const createStaffAttendanceMutation = useMutation(
    trpc.staffAttendance.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.staffAttendance.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      staffId: staffId ?? "",
      date: today,
      startDate: today,
      endDate: today,
      status: "present",
      observation: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const parsed = formSchema.safeParse(value);
        if (!parsed.success) {
          return { error: parsed.error.flatten().fieldErrors };
        }
      },
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.safeParse(value);
      if (!parsed.success) {
        toast.error(t("validation_error"));
        return;
      }
      toast.loading(t("Processing"), { id: 0 });
      createStaffAttendanceMutation.mutate({
        staffId: parsed.data.staffId,
        date: parsed.data.date,
        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate,
        status: parsed.data.status,
        observation: parsed.data.observation?.trim(),
      });
    },
  });

  useEffect(() => {
    form.setFieldValue("staffId", staffId ?? "");
  }, [form, staffId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pointage du personnels</CardTitle>
        <CardDescription>Saisir le pointage des enseignants</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <div className="col-span-2">
              <form.Field
                name="staffId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>
                          {t("staff")}
                        </FieldLabel>
                      </FieldContent>
                      <StaffSelector
                        defaultValue={field.state.value || undefined}
                        className="w-full"
                        onSelect={(val) => {
                          void setStaffId(val);
                          field.handleChange(val);
                        }}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
            <form.Field
              name="date"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Date de présence
                    </FieldLabel>
                    <DatePicker
                      defaultValue={field.state.value}
                      //@ts-expect-error TO fix later
                      onSelectAction={(val) => field.handleChange(val)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="status"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Statut</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="startDate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>H. Arrivée</FieldLabel>
                    <Input
                      id={field.name}
                      type="datetime-local"
                      value={formatDateTimeLocal(field.state.value)}
                      onChange={(event) =>
                        field.handleChange(
                          //@ts-expect-error TO fix later
                          parseDateTimeLocal(event.target.value),
                        )
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="endDate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>H. Départ</FieldLabel>
                    <Input
                      id={field.name}
                      type="datetime-local"
                      value={formatDateTimeLocal(field.state.value)}
                      onChange={(event) =>
                        field.handleChange(
                          //@ts-expect-error TO fix later
                          parseDateTimeLocal(event.target.value),
                        )
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <div className="col-span-4">
              <form.Field
                name="observation"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Observation</FieldLabel>
                      <Textarea
                        id={field.name}
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Button
                disabled={createStaffAttendanceMutation.isPending || !staffId}
                className="w-full"
                type="submit"
              >
                {createStaffAttendanceMutation.isPending && <Spinner />}
                {t("submit")}
              </Button>
              <Button
                variant={"secondary"}
                className="w-full"
                type="button"
                onClick={() => {
                  form.reset();
                }}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
