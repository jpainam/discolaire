import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { trpc } from "./api";
import { getBaseUrl } from "./base-url";
import { deleteToken, setToken } from "./session-store";

export const signIn = async (username: string, password: string) => {
  const res = await fetch(`${getBaseUrl()}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = (await res.json()) as {
    sessionToken?: string;
    schoolYearId?: string;
    error?: string;
  };
  if (!res.ok) throw new Error(data.error ?? "Login failed");
  if (!data.sessionToken) throw new Error("No session token returned");
  setToken(data.sessionToken);
  return true;
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return async (username: string, password: string) => {
    const success = await signIn(username, password);
    if (!success) return;
    await queryClient.invalidateQueries(trpc.pathFilter());
    router.replace("/");
  };
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  //const signOut = useMutation(trpc.auth.signOut.mutationOptions());
  const router = useRouter();

  return async () => {
    //const res = await signOut.mutateAsync();
    //if (!res.success) return;
    await deleteToken();
    await queryClient.invalidateQueries(trpc.pathFilter());
    router.replace("/");
  };
};
