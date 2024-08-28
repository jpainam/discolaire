"use client";

import { useEffect } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";

import { routes } from "~/configs/routes";

export default function LogoutPage() {
  useEffect(() => {
    void signOut({ redirect: true, callbackUrl: routes.auth.login });
  }, []);
  return (
    <div className="flex h-[100vh] flex-col items-center justify-center">
      <ReloadIcon className="h-10 w-10 animate-spin" />
    </div>
  );
}
