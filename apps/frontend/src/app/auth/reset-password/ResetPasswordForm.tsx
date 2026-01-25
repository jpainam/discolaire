"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
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
import { useRouter } from "~/hooks/use-router";

export function ResetPasswordForm({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState<string | null>();
  const [confirmPassword, setConfirmPassword] = useState<string | null>();

  const router = useRouter();

  const t = useTranslations();

  async function handleSubmit() {
    if (!password) {
      toast.error("Veuillez saisir le mot de passe");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les deux mots de passe doivent correspondre");
      return;
    }
    setIsLoading(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token: token,
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setIsSuccess(true);
    toast.success("Mot de passe réinitialisé avec succès");
    router.push("/auth/login");
  }

  return (
    <div className="bg-secondary flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("reset_password")}</CardTitle>
          <CardDescription>{t("enter_your_new_password")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <Alert>
              <KeyRound className="h-4 w-4" />

              <AlertTitle>{t("password_reset_successful")}</AlertTitle>
              <AlertDescription>
                {t("password_reset_successful_description")}
              </AlertDescription>
            </Alert>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSubmit();
              }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">{t("new_password")}</Label>

                <Input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("enter_your_new_password")}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">
                  {t("confirm_new_password")}
                </Label>

                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder={t("confirm_your_new_password")}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !password || !confirmPassword}
              >
                {isLoading ? t("resetting") : t("reset_password")}
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
