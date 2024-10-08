"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { useRouter } from "@repo/hooks/use-router";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Separator } from "@repo/ui/separator";
import { Textarea } from "@repo/ui/textarea";

import { InputField } from "~/components/shared/forms/input-field";
import PrefixSelector from "~/components/shared/forms/PrefixSelector";
import { routes } from "~/configs/routes";
import { api } from "~/trpc/react";

const createEditContactSchema = z.object({
  prefix: z.string().optional(),
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  title: z.string().optional(),
  employer: z.string().optional(),
  phoneNumber1: z.string().min(1),
  phoneNumber2: z.string().optional(),
  email: z.string().email(),
  address: z.string().optional(),
  observation: z.string().optional(),
});

type CreateEditContactValues = z.infer<typeof createEditContactSchema>;

type ContactAllProcedureOutput = NonNullable<
  RouterOutputs["contact"]["all"]
>[number];

//type ContactGetProcedureOutput = NonNullable<RouterOutputs["contact"]["get"]>;

interface CreateEditContactProps {
  contact?: ContactAllProcedureOutput;
}

export default function CreateEditContact({ contact }: CreateEditContactProps) {
  const { closeSheet } = useSheet();
  const form = useForm<CreateEditContactValues>({
    resolver: zodResolver(createEditContactSchema),
    defaultValues: {
      prefix: contact?.prefix ?? "",
      lastName: contact?.lastName ?? "",
      firstName: contact?.firstName ?? "",
      title: contact?.title ?? "",
      employer: contact?.employer ?? "",
      phoneNumber1: contact?.phoneNumber1 ?? "",
      phoneNumber2: contact?.phoneNumber2 ?? "",
      email: contact?.email ?? "",
      address: contact?.address ?? "",
      observation: contact?.observation ?? "",
    },
  });
  const { t } = useLocale();
  const utils = api.useUtils();
  const router = useRouter();

  const createContactMutation = api.contact.create.useMutation({
    onSettled: () => utils.contact.invalidate(),
    onSuccess: (result) => {
      closeSheet();
      toast.success(t("created_successfully"), { id: 0 });
      router.push(routes.contacts.details(result.id));
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const updateContactMutation = api.contact.update.useMutation({
    onSettled: () => utils.contact.invalidate(),
    onSuccess: (result) => {
      closeSheet();
      toast.success(t("updated_successfully"), { id: 0 });
      router.push(routes.contacts.details(result.id));
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const onSubmit = (data: z.infer<typeof createEditContactSchema>) => {
    const values = {
      ...data,
      email: data.email || "",
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
      <form className="h-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-[80vh] overflow-y-auto">
          {/* <div className="grid items-center gap-2 px-4 py-2 md:grid-cols-[30%_70%]"> */}
          <div className="grid gap-2 px-4 py-2 md:grid-cols-2">
            <div className="col-span-2">
              <div className="grid grid-cols-[25%_75%] gap-1">
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
                        <Input
                          className="w-full"
                          onChange={field.onChange}
                          defaultValue={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <InputField name="firstName" label={t("firstName")} />
            <InputField name="email" label={t("email")} />
          </div>
          <div className="grid items-center gap-2 border-y bg-muted/50 px-4 pb-2 md:grid-cols-2">
            <InputField name="title" label={t("title")} />
            <InputField name="employer" label={t("employer")} />
          </div>
          <div className="grid items-center gap-2 px-4 py-2 md:grid-cols-2">
            <InputField name="phoneNumber1" label={t("phoneNumber") + "1"} />
            <InputField name="phoneNumber2" label={t("phoneNumber") + "2"} />
          </div>
          <div className="col-span-2 px-4 pb-2">
            <InputField name="address" label={t("address")} />
          </div>
          <div className="md:grid-cols- grid items-center gap-2 border-y bg-muted/50 px-4 py-2">
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full">
                  <FormLabel>{t("observation")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("observation")}
                      // className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-row items-center justify-end gap-2 px-4">
          <Button
            type="button"
            onClick={() => {
              closeSheet();
            }}
            variant={"outline"}
            size={"sm"}
          >
            {t("cancel")}
          </Button>
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
        </div>
      </form>
    </Form>
  );
}
