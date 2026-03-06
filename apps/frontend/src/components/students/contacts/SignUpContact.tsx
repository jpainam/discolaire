"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { authClient } from "~/auth/client";
import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { showErrorToast } from "~/lib/handle-error";
import { useTRPC } from "~/trpc/react";
import { SignUpContactIcon } from "./SignUpContactIcon";

function generateUsername(firstName: string, lastName: string): string {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${normalize(firstName)}.${normalize(lastName)}.${suffix}`;
}

export function SignUpContact() {
  const params = useParams<{ id: string }>();

  const t = useTranslations();
  const trpc = useTRPC();
  const studentContactsQuery = useQuery(
    trpc.student.contacts.queryOptions(params.id),
  );
  const queryClient = useQueryClient();
  const createUserMutation = useMutation(trpc.user.create.mutationOptions());

  if (studentContactsQuery.isPending) {
    return (
      <div className="p-4">
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  if (studentContactsQuery.error) {
    showErrorToast(studentContactsQuery.error);
    return;
  }
  if (studentContactsQuery.data.length === 0) {
    return <EmptyComponent />;
  }

  const pendingContacts = studentContactsQuery.data.filter(
    (std) => !std.contact.userId,
  );
  if (pendingContacts.length === 0) {
    return;
  }

  const handleSendInvites = async () => {
    const toastId = "send-invite";
    toast.loading(t("Processing"), { id: toastId });

    let successCount = 0;
    for (const std of pendingContacts) {
      if (!std.contact.email) {
        toast.error(
          `${t("email_not_found")} ${std.contact.lastName} ${std.contact.firstName}`,
        );
        continue;
      }

      // Only create user if they don't already exist in better-auth
      const existingUser = await queryClient.fetchQuery(
        trpc.user.getByEmail.queryOptions({ email: std.contact.email }),
      );
      if (existingUser) {
        // Email is already linked to another account in this school — skip silently.
        // The admin should resolve the duplicate email before sending an invite.
        toast.warning(
          `${std.contact.lastName} ${std.contact.firstName} : cet e-mail est déjà utilisé par un autre compte.`,
        );
        continue;
      }

      await createUserMutation.mutateAsync({
        entityId: std.contact.id,
        profile: "contact",
        email: std.contact.email,
        username: generateUsername(
          std.contact.firstName ?? "",
          std.contact.lastName ?? "",
        ),
      });

      const { error } = await authClient.requestPasswordReset({
        email: std.contact.email,
        redirectTo: new URL(
          "/auth/complete-registration",
          window.location.origin,
        ).toString(),
      });
      if (error) {
        toast.error(error.message);
      } else {
        successCount++;
      }
    }

    if (successCount > 0) {
      toast.success(t("invite_sent_successfully"), { id: toastId });
    } else {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex flex-row gap-4 px-4 py-2 text-sm">
      <div className="text-accent-foreground flex w-full flex-col rounded-xl border border-[#f3ba63] bg-[#fff9ed] p-4 dark:border-[#693f05] dark:bg-[#271700]">
        <div className="flex flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <div className="color-gray-900 text-md flex w-full flex-row justify-between font-bold">
              {pendingContacts.length === 1
                ? t("contact_has_not_signed_up", { n: pendingContacts.length })
                : t("contacts_have_not_signed_up", {
                    n: pendingContacts.length,
                  })}
            </div>
            <div className="mt-2 flex flex-col gap-4">
              <div className="flex flex-col text-[#4e2009] dark:text-[#f1a10d]">
                <p>{t("contact_have_not_signed_up_description")}</p>
                <Link
                  href={"https://docs.discolaire.com/account#contacts"}
                  target="_blank"
                  className="inline-flex w-fit text-xs text-[#ad5700] hover:text-blue-600 hover:underline dark:text-[#fef3dd]"
                >
                  {t("read_more_from_account_guide")}
                </Link>
              </div>

              <Button
                onClick={handleSendInvites}
                variant={"default"}
                className="w-fit"
              >
                {t("send_invite")}
              </Button>
            </div>
          </div>
          <div className="flex flex-row">
            <SignUpContactIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
