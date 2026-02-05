"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { InputField } from "~/components/shared/forms/input-field";
import PrefixSelector from "~/components/shared/forms/PrefixSelector";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useSheet } from "~/hooks/use-sheet";
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
  email: z.email().optional().or(z.literal("")),
  observation: z.string().optional(),
});

interface CreateEditContactProps {
  contact?:
    | RouterOutputs["contact"]["all"][number]
    | RouterOutputs["contact"]["get"];
  studentId?: string;
}

export default function CreateEditContact({
  contact,
  studentId,
}: CreateEditContactProps) {
  const { closeSheet } = useSheet();
  const form = useForm({
    resolver: standardSchemaResolver(createEditContactSchema),
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

  const t = useTranslations();
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
            createStudentContactMutation.mutate([
              {
                contactId: data.id,
                studentId: studentId,
                relationshipId: relationshipId,
              },
            ]);
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
      email: data.email,
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
        className="flex flex-1 flex-col gap-6 overflow-hidden"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid flex-1 auto-rows-min gap-4 overflow-y-auto">
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <InputField name="phoneNumber1" label={t("phoneNumber") + "1"} />
          <InputField name="phoneNumber2" label={t("phoneNumber") + "2"} />

          <InputField name="occupation" label={t("occupation")} />
          <InputField name="employer" label={t("employer")} />

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

        <div className="flex flex-col gap-2">
          <Button
            disabled={
              createContactMutation.isPending || updateContactMutation.isPending
            }
            type="submit"
            variant={"default"}
          >
            {createContactMutation.isPending ||
              (updateContactMutation.isPending && (
                <Loader className="h-4 w-4 animate-spin" />
              ))}
            {contact ? t("edit") : t("submit")}
          </Button>

          <Button type="button" variant="outline">
            {t("close")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
