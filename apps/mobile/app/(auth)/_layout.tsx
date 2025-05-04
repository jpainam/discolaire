import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "~/providers/auth-provider";

export default function AuthLayout() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
