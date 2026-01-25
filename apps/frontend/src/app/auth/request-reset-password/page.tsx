"use client";

import { useState } from "react";
import { Loader, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { authClient } from "~/auth/client";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { env } from "~/env";
import { useRouter } from "~/hooks/use-router";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>();
  const router = useRouter();

  const t = useTranslations();

  return (
    <div className="bg-secondary flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("Forgot password")}</CardTitle>
          <CardDescription>
            {t("enter_your_email_to_reset_your_password")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <Alert>
              <Mail className="h-4 w-4 text-green-900 dark:text-green-300" />
              <AlertTitle className="font-bold text-green-900 dark:text-green-300">
                {t("check_your_email")}
              </AlertTitle>
              <AlertDescription>
                {t("we_have_sent_you_an_email_with_reset_instructions")}
              </AlertDescription>
            </Alert>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) {
                  toast.warning("Veuillez saisir une adresse email valide");
                  return;
                }
                setIsLoading(true);
                const { error } = await authClient.requestPasswordReset({
                  email,
                  redirectTo: `${env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
                });
                if (error) {
                  console.error(error);
                  setIsLoading(false);
                  toast.error("Une erreur s'est produite");
                  return;
                }

                toast.success("Un e-mail de réinitialisation a été envoyé");
                setIsSuccess(true);
              }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">{t("email")}</Label>

                <Input
                  required
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  t("send_reset_link")
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/auth/login")}>
            {t("back_to_login")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
