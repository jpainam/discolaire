"use client";

import { useEffect, useTransition } from "react";
import { AtSign, Loader } from "lucide-react";
import { z } from "zod";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Skeleton } from "@repo/ui/skeleton";

import { api } from "~/trpc/react";

const createEditSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
export function UserLoginCard({ userId }: { userId: string }) {
  const { t } = useLocale();

  const userQuery = api.user.get.useQuery(userId);
  const [isPending, startTransition] = useTransition();

  const sendResetPassword = async () => {
    await new Promise((resolve) => setTimeout(resolve, 50000));
  };
  const form = useForm({
    schema: createEditSchema,
    defaultValues: {
      username: "",
      password: "",
    },
  });
  useEffect(() => {
    if (userQuery.data) {
      form.reset(userQuery.data);
    }
  }, [form, userQuery.data]);

  //const user = userQuery.data;
  if (userQuery.isPending) {
    return (
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  <Form {...form}>
    <form>
      <Label className="text-md">{t("username")}</Label>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>desc.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Label className="text-md">{t("password")}</Label>
      <div>******************</div>
      <div></div>
      <Button
        variant={"outline"}
        size={"sm"}
        className="w-fit text-destructive"
        onClick={() => {
          startTransition(async () => {
            await sendResetPassword();
          });
        }}
      >
        {isPending ? (
          <Loader className="mr-1 h-3 w-3 animate-spin" />
        ) : (
          <AtSign className="mr-2 h-3 w-3" />
        )}
        {t("send_reset_password")}
      </Button>
    </form>
  </Form>;
}
