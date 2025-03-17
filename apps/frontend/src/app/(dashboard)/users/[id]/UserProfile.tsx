"use client";
import type { RouterOutputs } from "@repo/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { t } from "i18next";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/trpc/react";

const usernameSchema = z.object({
  username: z.string().min(3),
  email: z.string().optional(),
  name: z.string().optional(),
});
export function UserProfile({
  user,
}: {
  user: NonNullable<RouterOutputs["user"]["get"]>;
}) {
  const form = useForm({
    schema: usernameSchema,
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      username: user.username,
    },
  });
  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
    onError: (err) => {
      toast.error(err.message, { id: 0 });
    },
  });
  const handleSubmit = (data: z.infer<typeof usernameSchema>) => {
    toast.loading(t("updating"), { id: 0 });
    updateUser.mutate({
      id: user.id,
      username: data.username,
      email: data.email,
      name: data.name,
    });
  };
  return (
    <div className="mx-auto max-w-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("personal_information")}
              </CardTitle>
              <CardDescription>
                {t("personal_information_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={user.avatar ?? undefined}
                      alt={user.name ?? ""}
                    />
                    <AvatarFallback className="text-2xl font-bold uppercase">
                      {user.name?.slice(0, 2) ?? "N/A"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" type="button" size="sm">
                    {t("change_avatar")}
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("username")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fullName")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("email")}</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button size={"sm"} isLoading={updateUser.isPending}>
                {t("submit")}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
