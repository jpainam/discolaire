/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";

import PrefixSelector from "~/components/shared/forms/PrefixSelector";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const createEditContactSchema = z.object({
  prefix: z.string().optional(),
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  phoneNumber1: z.string().min(1),
  address: z.string().optional(),
  observation: z.string().optional(),
  emergencyContact: z.boolean().optional().default(true),
});

export function CreateParent({
  setParentIdAction,
}: {
  setParentIdAction: (id: string, name: string, relationshipId: string) => void;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(createEditContactSchema),
    defaultValues: {
      prefix: "",
      lastName: "",
      firstName: "",
      occupation: "",
      employer: "",
      phoneNumber1: "",
      emergencyContact: true,
      address: "",
      observation: "",
    },
  });
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  const relationshipsQuery = useQuery(
    trpc.contactRelationship.all.queryOptions(),
  );
  const [relationshipId, setRelationshipId] = useState<string | null>(null);

  const createContactMutation = useMutation(
    trpc.contact.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.contact.pathFilter());
        if (relationshipId) {
          setParentIdAction(data.id, getFullName(data), relationshipId);
        }
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
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
      address: data.address,
      observation: data.observation,
    };

    toast.loading(t("creating"), { id: 0 });
    createContactMutation.mutate({ ...values });
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="prefix"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>{t("lastName")}</FormLabel>
              <FormControl>
                <Input onChange={field.onChange} defaultValue={field.value} />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <Label>{t("relationship")}</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("relationship")} />
            </SelectTrigger>
            <SelectContent>
              {relationshipsQuery.isPending ? (
                <SelectItem value="-">Loading...</SelectItem>
              ) : (
                relationshipsQuery.data?.map((relationship) => (
                  <SelectItem
                    key={relationship.id}
                    value={relationship.id.toString()}
                  >
                    {relationship.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <FormField
          control={form.control}
          name="phoneNumber1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phoneNumber")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("occupation")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="employer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("employer")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("address")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>{t("observation")}</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emergencyContact"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2">
              <FormControl>
                <Checkbox
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              </FormControl>
              <FormLabel>{t("emergencyContact")}</FormLabel>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          <Button
            disabled={createContactMutation.isPending}
            type="submit"
            size={"sm"}
            variant={"default"}
          >
            {t("submit")}
          </Button>

          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            variant="outline"
            size={"sm"}
          >
            {t("close")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
