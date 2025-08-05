"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { SheetClose, SheetFooter } from "@repo/ui/components/sheet";
import { Textarea } from "@repo/ui/components/textarea";

import { InputField } from "~/components/shared/forms/input-field";
import PrefixSelector from "~/components/shared/forms/PrefixSelector";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const createEditContactSchema = z.object({
  prefix: z.string().optional(),
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  phoneNumber1: z.string().min(1),
  phoneNumber2: z.string().optional(),
  address: z.string().optional(),
  observation: z.string().optional(),
});

type ContactAllProcedureOutput = NonNullable<
  RouterOutputs["contact"]["all"]
>[number];

interface CreateEditContactProps {
  contact?: ContactAllProcedureOutput;
  studentId?: string;
}

export default function CreateEditContact({
  contact,
  studentId,
}: CreateEditContactProps) {
  const { closeSheet } = useSheet();
  const form = useForm({
    resolver: zodResolver(createEditContactSchema),
    defaultValues: {
      prefix: contact?.prefix ?? "",
      lastName: contact?.lastName ?? "",
      firstName: contact?.firstName ?? "",
      occupation: contact?.occupation ?? "",
      employer: contact?.employer ?? "",
      phoneNumber1: contact?.phoneNumber1 ?? "",
      phoneNumber2: contact?.phoneNumber2 ?? "",
      address: contact?.address ?? "",
      observation: contact?.observation ?? "",
    },
  });
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createStudentContactMutation = useMutation(
    trpc.studentContact.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.students.pathFilter());
        await queryClient.invalidateQueries(trpc.student.contacts.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const relationshipsQuery = useQuery(
    trpc.studentContact.relationships.queryOptions(),
  );

  const createContactMutation = useMutation(
    trpc.contact.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.contact.pathFilter());

        if (studentId && relationshipsQuery.data) {
          const relationshipId = relationshipsQuery.data[0]?.id;
          if (relationshipId) {
            createStudentContactMutation.mutate({
              contactId: data.id,
              studentId: studentId,
              data: {
                relationshipId: relationshipId,
              },
            });
          }
        }
        toast.success(t("created_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateContactMutation = useMutation(
    trpc.contact.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const onSubmit = (data: z.infer<typeof createEditContactSchema>) => {
    const values = {
      prefix: data.prefix,
      lastName: data.lastName,
      firstName: data.firstName,
      occupation: data.occupation,
      employer: data.employer,
      phoneNumber1: data.phoneNumber1,
      phoneNumber2: data.phoneNumber2,
      address: data.address,
      observation: data.observation,
    };
    if (contact) {
      toast.loading(t("updating"), { id: 0 });
      updateContactMutation.mutate({ id: contact.id, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createContactMutation.mutate({ ...values });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid flex-1 auto-rows-min gap-4 overflow-y-auto px-4">
          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t("civility")}</FormLabel>
                <FormControl>
                  <PrefixSelector
                    className="w-full"
                    onChange={field.onChange}
                    defaultValue={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t("lastName")}</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    onChange={field.onChange}
                    defaultValue={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <InputField
            name="firstName"
            className="col-span-2"
            label={t("firstName")}
          />

          <InputField name="occupation" label={t("occupation")} />
          <InputField name="employer" label={t("employer")} />

          <InputField name="phoneNumber1" label={t("phoneNumber") + "1"} />
          <InputField name="phoneNumber2" label={t("phoneNumber") + "2"} />

          <InputField
            name="address"
            className="col-span-2"
            label={t("address")}
          />

          <FormField
            control={form.control}
            name="observation"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t("observation")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("observation")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <SheetFooter>
          <Button
            disabled={
              createContactMutation.isPending || updateContactMutation.isPending
            }
            type="submit"
            size={"sm"}
            variant={"default"}
          >
            {createContactMutation.isPending ||
              (updateContactMutation.isPending && (
                <Loader className="h-4 w-4 animate-spin" />
              ))}
            {contact ? t("edit") : t("submit")}
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline" size={"sm"}>
              {t("close")}
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
