"use client";

import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  registrationPrefix: z.string().min(1),
});

export default function Page() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();
  const createSchoolMutation = useMutation(
    trpc.school.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.school.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        router.push("/administration/my-school");
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      registrationPrefix: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast.loading(t("creating"), { id: 0 });
    createSchoolMutation.mutate(data);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-8 gap-y-4 px-4 pt-8 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("code")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registrationPrefix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("registrationPrefix")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full flex flex-row items-center gap-4">
          <Button
            type="button"
            onClick={() => {
              router.push("/administration/my-school");
            }}
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button isLoading={createSchoolMutation.isPending} type="submit">
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
