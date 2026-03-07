"use client";

import { useParams } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { useTRPC } from "~/trpc/react";

const usernameSchema = z.object({
  username: z.string().min(3),
  email: z.string().optional(),
  name: z.string().optional(),
});

export function UserProfile() {
  const trpc = useTRPC();
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: user } = useSuspenseQuery(
    trpc.user.get.queryOptions(params.id),
  );

  const form = useForm({
    resolver: standardSchemaResolver(usernameSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      username: user.username,
    },
  });

  const updateUser = useMutation(
    trpc.user.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.get.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    }),
  );

  const handleSubmit = (values: z.infer<typeof usernameSchema>) => {
    toast.loading(t("updating"), { id: 0 });
    updateUser.mutate({
      id: params.id,
      username: values.username,
      email: values.email,
      name: values.name,
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
            <CardContent className="space-y-4">
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button disabled={updateUser.isPending}>
                {updateUser.isPending && <Spinner />}
                {t("submit")}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
