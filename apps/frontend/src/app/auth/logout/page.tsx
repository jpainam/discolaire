"use client";
import { routes } from "@/configs/routes";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ redirect: true, callbackUrl: routes.auth.login });
  }, []);
  return (
    <div className="flex flex-col h-[100vh] items-center justify-center">
      <ReloadIcon className="w-10 h-10 animate-spin" />
    </div>
  );
}
