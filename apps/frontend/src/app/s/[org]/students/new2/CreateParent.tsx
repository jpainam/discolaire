/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
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

export default function CreateParent({
  setParentIdAction,
}: {
  setParentIdAction: (id: string, relationshipId: string) => void;
}) {
  const { closeSheet } = useSheet();
  const form = useForm({
    resolver: zodResolver(createEditContactSchema),
    defaultValues: {
      prefix: "",
      lastName: "",
      firstName: "",
      occupation: "",
      employer: "",
      phoneNumber1: "",
      phoneNumber2: "",
      address: "",
      observation: "",
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
  const [relationshipId, setRelationshipId] = useState<string | null>(null);

  const createContactMutation = useMutation(
    trpc.contact.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.contact.pathFilter());
        if (relationshipId) setParentIdAction(data.id, relationshipId);
        toast.success(t("created_successfully"), { id: 0 });
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

    toast.loading(t("creating"), { id: 0 });
    createContactMutation.mutate({ ...values });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("civility")}</FormLabel>
                <FormControl>
                  <PrefixSelector
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
              <FormItem>
                <FormLabel>{t("lastName")}</FormLabel>
                <FormControl>
                  <Input onChange={field.onChange} defaultValue={field.value} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstName")}</FormLabel>
                <FormControl>
                  <Input onChange={field.onChange} defaultValue={field.value} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div>
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

        <div className="flex items-center justify-end gap-2">
          <Button
            disabled={createContactMutation.isPending}
            type="submit"
            size={"sm"}
            variant={"default"}
          >
            {t("submit")}
          </Button>

          <Button type="button" variant="outline" size={"sm"}>
            {t("close")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
