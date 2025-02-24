import type { Metadata } from "next";
import Link from "next/link";

import { getServerTranslations } from "~/i18n/server";

import { ModeToggle } from "~/components/mode-toggle";
import { routes } from "~/configs/routes";
import { api } from "~/trpc/server";
import { UserAuthForm } from "./user-auth-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication page.",
};

export default async function Page() {
  const { t } = await getServerTranslations();

  const { verse, book } = await api.bible.random();

  return (
    <>
      <div className="container relative h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute right-4 top-4 flex flex-row gap-2 md:right-8 md:top-8">
          <ModeToggle />
        </div>
        <div className="relative hidden h-full flex-col bg-muted bg-[url('/images/bg-login.png')] bg-cover bg-no-repeat p-10 dark:border-r md:block lg:flex">
          {/* <div className="absolute inset-0 bg-zinc-900" /> */}
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link className="flex flex-row" href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              {t("school_portal")}
            </Link>
          </div>
          <div className="relative z-20 mt-auto rounded-md bg-secondary/40">
            <blockquote className="space-y-2">
              <p className="text-lg tracking-tighter">
                {verse ?? t("signin_quote")}
              </p>
              <footer className="text-sm">{book ?? "Ellen G. White"}</footer>
            </blockquote>
          </div>
        </div>
        <div className="p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("welcome_back")}
              </h1>
              {/* <p className="text-sm text-muted-foreground">
                {t("enter_email_below_to_sign_in")}
              </p> */}
            </div>
            <UserAuthForm />
            <div className="mt-4 text-center text-sm">
              {t("dont_have_an_account")}{" "}
              <Link href={routes.auth.signup} className="underline">
                {t("sign_up")}
              </Link>
            </div>
            <div className="grid flex-row justify-between py-8 text-sm text-muted-foreground md:flex">
              {/* {t("by_clicking_text")}{" "} */}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("terms_of_service")}
              </Link>
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("privacy_policy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
