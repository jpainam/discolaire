"use client";

import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "~/auth/client";
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

export function CompleteRegistrationForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  async function handleSubmit() {
    if (!username) {
      toast.error("Veuillez choisir un nom d'utilisateur");
      return;
    }
    if (!password) {
      toast.error("Veuillez saisir un mot de passe");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les deux mots de passe doivent correspondre");
      return;
    }

    setIsLoading(true);

    // 1. Set the password using the invite token
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    if (resetError) {
      toast.error(resetError.message);
      setIsLoading(false);
      return;
    }

    // 2. Sign in to get a session (email was passed via invite link)
    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });
    if (signInError) {
      toast.error(signInError.message);
      setIsLoading(false);
      return;
    }

    // 3. Update username (requires active session)
    const { error: updateError } = await authClient.updateUser({ username });
    if (updateError) {
      toast.error(updateError.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.push("/");
  }

  return (
    <div className="bg-secondary flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bienvenue sur Discolaire</CardTitle>
          <CardDescription>
            Choisissez un nom d&apos;utilisateur et créez votre mot de passe
            pour accéder à votre espace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: jean.dupont"
                required
                autoComplete="username"
              />
              <p className="text-muted-foreground text-xs">
                Ce nom sera utilisé pour vous connecter.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choisissez un mot de passe"
                required
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                placeholder="Confirmez votre mot de passe"
                required
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !username || !password || !confirmPassword}
            >
              {isLoading ? "Activation en cours..." : "Activer mon compte"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/auth/login")}>
            Se connecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
