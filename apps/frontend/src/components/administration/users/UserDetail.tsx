"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@radix-ui/react-avatar";
import { ExternalLink, LucideSave, Mail, Trash } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import { Textarea } from "@repo/ui/components/textarea";
import { useLocale } from "~/i18n";

import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { api } from "~/trpc/react";

const userFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is invalid" }),
  avatar: z.string().url().nullish(),
  password: z.string().min(8, { message: "Password is required" }),
  createdAt: z.coerce.date().nullish(),
  emailVerified: z.coerce.date().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function UserDetails() {
  const searchParms = useSearchParams();

  const useQuery = api.user.get.useQuery(searchParms.get("id") ?? "");
  const user = useQuery.data;
  const defaultValues = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: user?.avatar ?? "",
    createdAt: user?.createdAt ?? new Date(),
    password: user?.password ?? "",
  };
  const form = useForm<UserFormValues>({
    defaultValues: defaultValues,
    resolver: zodResolver(userFormSchema),
  });

  useEffect(() => {
    const val = {
      name: user?.name ?? "",
      email: user?.email ?? "",
      avatar: user?.avatar ?? "",
      password: user?.password ?? "",
      createdAt: user?.createdAt ?? new Date(),
    };
    form.reset(val);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const { t } = useLocale();
  const onSubmit: SubmitHandler<UserFormValues> = (_data: UserFormValues) => {
    /*setLoading(true);
     setTimeout(() => {
       setLoading(false);
       console.log("product_data", data);
       toast.success(<p>Personnel {id ? "modifié" : "créé"} avec succès</p>);
       methods.reset();
     }, 600);*/
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center">
              <Avatar className="flex h-[100px] w-[100px] items-center justify-center space-y-0">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-md items-center justify-center font-bold">
              {user?.name ?? "Jean-Paul Ainam"}
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Button
                className="items-center justify-between"
                type="button"
                asChild
                variant={"outline"}
              >
                <Link href={`/mail?maito:${user?.email}`} target="_blank">
                  <span className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    {t("email")}
                  </span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="justify-between"
                type="button"
                variant={"destructive"}
              >
                <span className="flex items-center">
                  <Trash className="mr-2 h-4 w-4" />
                  {t("delete")}
                </span>
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <InputField
                label={t("name")}
                className="flex flex-row items-center justify-center gap-2"
                name={"name"}
                inputClassName="h-8"
                labelClassName="w-[150px]"
                //inputClassName="h-6 rounded-none"
              />
              <InputField
                label={t("email")}
                className="flex flex-row items-center justify-center gap-2"
                name="email"
                inputClassName="h-8"
                labelClassName="w-[150px]"
              />
              <InputField
                label="Avatar"
                inputClassName="h-8"
                name="avatar"
                className="flex flex-row items-center justify-center gap-2"
                labelClassName="w-[150px]"
              />
              <InputField
                label={t("password")}
                type="password"
                inputClassName="h-8"
                className="flex flex-row items-center justify-center gap-2"
                name="password"
                labelClassName="w-[150px]"
              />
              <DatePickerField
                labelClassName="w-[150px]"
                className="mr-2 flex-row items-center justify-center gap-2"
                label={t("createdAt")}
                name="createdAt"
              />
              <div className="my-2 mr-2 flex flex-row justify-between gap-4">
                <Label>{t("is_email_verified")}</Label>
                <Switch />
              </div>
              <Textarea
                rows={5}
                placeholder={t("observation")}
                name="observation"
              />
            </div>
            <div className="flex flex-row justify-end">
              <Button type="submit" variant={"default"}>
                <LucideSave className="mr-2 h-4 w-4" /> {t("submit")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
