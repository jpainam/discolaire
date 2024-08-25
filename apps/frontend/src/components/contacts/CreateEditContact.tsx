"use client";

import { InputField } from "@/components/shared/forms/input-field";
import PrefixSelector from "@/components/shared/forms/PrefixSelector";
import { useLocale } from "@/hooks/use-locale";
import { useSheet } from "@/hooks/use-sheet";
import { getErrorMessage } from "@/lib/handle-error";
import { AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/form";
import { Separator } from "@repo/ui/separator";
import { Textarea } from "@repo/ui/textarea";
import { inferProcedureOutput } from "@trpc/server";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Input } from "../ui/input";

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
  inferProcedureOutput<AppRouter["contact"]["all"]>
>[number];

type ContactGetProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["contact"]["get"]>
>;

type CreateEditContactProps = {
  contact?: ContactAllProcedureOutput | ContactGetProcedureOutput;
};

export default function CreateEditContact({ contact }: CreateEditContactProps) {
  const { closeSheet } = useSheet();
  const form = useForm<CreateEditContactValues>({
    resolver: zodResolver(createEditContactSchema),
    defaultValues: {
      prefix: contact?.prefix || "",
      lastName: contact?.lastName || "",
      firstName: contact?.firstName || "",
      title: contact?.title || "",
      employer: contact?.employer || "",
      phoneNumber1: contact?.phoneNumber1 || "",
      phoneNumber2: contact?.phoneNumber2 || "",
      email: contact?.email || "",
      address: contact?.address || "",
      observation: contact?.observation || "",
    },
  });
  const { t } = useLocale();

  const createContactMutation = api.contact.create.useMutation();
  const updateContactMutation = api.contact.update.useMutation();
  const utils = api.useUtils();

  const onSubmit = (data: z.infer<typeof createEditContactSchema>) => {
    const values = {
      ...data,
      email: data.email || "",
    };
    if (contact) {
      toast.promise(
        updateContactMutation.mutateAsync({ id: contact.id, ...values }),
        {
          loading: t("updating"),
          error: (error) => {
            return getErrorMessage(error);
          },
          success: () => {
            utils.contact.get.invalidate(contact.id);
            closeSheet();
            return t("updated_successfully");
          },
        },
      );
    } else {
      toast.promise(createContactMutation.mutateAsync({ ...values }), {
        loading: t("creating"),
        error: (error) => {
          return getErrorMessage(error);
        },
        success: () => {
          utils.contact.all.invalidate();
          closeSheet();
          return t("created_successfully");
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form className="h-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-[80vh] overflow-y-auto">
          <div className="grid items-center gap-2 px-4 py-2 md:grid-cols-[30%_70%]">
            <FormLabel>{t("civility")}</FormLabel>
            <div className="grid grid-cols-[25%_75%] gap-1">
              <FormField
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <FormItem className="f flex">
                    <PrefixSelector
                      className="w-full"
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="f flex">
                    <Input
                      className="w-full"
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormItem>
                )}
              />
            </div>
            {/* <FormLabel>{t("lastName")}</FormLabel> */}
            {/* <InputField name="lastName" /> */}
            <FormLabel>{t("firstName")}</FormLabel>
            <InputField name="firstName" />
          </div>
          <div className="grid items-center gap-2 border-y bg-muted/50 px-4 py-2 md:grid-cols-[30%_70%]">
            <FormLabel>{t("title")}</FormLabel>
            <InputField name="title" />
            <FormLabel>{t("employer")}</FormLabel>
            <InputField name="employer" />
          </div>
          <div className="grid items-center gap-2 px-4 py-2 md:grid-cols-[30%_70%]">
            <FormLabel>{t("phoneNumber")} 1 </FormLabel>
            <InputField name="phoneNumber1" />
            <FormLabel>{t("phoneNumber")} 2 </FormLabel>
            <InputField name="phoneNumber2" />
            <FormLabel>{t("email")} </FormLabel>
            <InputField name="email" />
            <FormLabel>{t("address")} </FormLabel>
            <InputField name="address" />
          </div>
          <div className="grid items-center gap-2 border-y bg-muted/50 px-4 py-2 md:grid-cols-[30%_70%]">
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
