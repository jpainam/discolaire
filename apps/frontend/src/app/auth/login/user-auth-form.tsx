import * as React from "react";

import { signIn } from "@repo/auth";
import { getServerTranslations } from "@repo/i18n/server";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

import { Icons } from "~/components/icons";
import { cn } from "~/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

// const authFormSchema = z.object({
//   email: z.string().email().min(1),
//   password: z.string().min(1),
// });

export async function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  // const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // const form = useForm<z.infer<typeof authFormSchema>>({
  //   resolver: zodResolver(authFormSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   },
  // });
  // function onSubmit(data: z.infer<typeof authFormSchema>) {
  //   setIsLoading(true);
  //   console.log(data);

  //   const res = await signIn("credentials", {
  //     username: data.email,
  //     password: data.password,
  //     redirect: false,
  //   });

  //   if (res?.error) {
  //     alert("Error: " + res.error);
  //     //res?.error && toast.error(res.error);
  //   } else {
  //     alert("Success");
  //     //validateAuth(); // TODO FIX THIS
  //   }
  //   setIsLoading(false);
  // }
  const { t } = await getServerTranslations("auth");
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* <Form {...form}> */}
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", formData);
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="username">{t("email")}</Label>
          <Input
            id="username"
            autoCorrect="off"
            name="username"
            autoComplete="email"
            type="email"
            required
            autoCapitalize="none"
            placeholder={"m@example.com"}
          />
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            required
            current-password="true"
            type="password"
            name="password"
            id="password"
          />
          <Button type="submit">{t("signin_with_email")}</Button>
        </div>
      </form>
      {/* </Form> */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("or_continue_with")}
          </span>
        </div>
      </div>
      <form className="w-full">
        <Button
          variant="outline"
          className="w-full"
          type="submit"
          formAction={async () => {
            "use server";
            await signIn("google", { callbackUrl: "/" });
          }}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </form>
    </div>
  );
}
