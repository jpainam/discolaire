"use client";

import { useParams } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ImageMinus, ImageUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { AvatarState } from "~/components/AvatarState";
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
import { ChangeAvatarButton } from "~/components/users/ChangeAvatarButton";
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
  const queryClient = useQueryClient();

  const handleDeleteAvatar = async (userId: string) => {
    toast.loading(t("deleting"), { id: 0 });
    const response = await fetch(`/api/upload/avatars?userId=${userId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success(t("deleted_successfully"), {
        id: 0,
      });
      await queryClient.invalidateQueries(trpc.user.get.pathFilter());
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { error } = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      toast.error(error ?? response.statusText, { id: 0 });
    }
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
              <div className="flex flex-col items-start gap-6 md:flex-row">
                <div className="flex flex-col items-center space-y-2">
                  <AvatarState
                    pos={user.name.length}
                    avatar={user.avatar}
                    className="mb-2 h-[100px] w-[100px]"
                  />

                  {user.avatar ? (
                    <Button
                      onClick={() => {
                        void handleDeleteAvatar(user.id);
                      }}
                      variant={"outline"}
                      size={"sm"}
                      type="button"
                    >
                      <ImageMinus />
                      {t("Remove avatar")}
                    </Button>
                  ) : (
                    <ChangeAvatarButton userId={user.id}>
                      <Button type="button" variant={"outline"} size={"sm"}>
                        <ImageUpIcon />
                        {t("change_avatar")}
                      </Button>
                    </ChangeAvatarButton>
                  )}
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
                </div>
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
