"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { render } from "@react-email/components";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";

import { EmptyState } from "~/components/EmptyState";
import { SendInvite } from "~/email-templates/SendInvite";
import { env } from "~/env";
import { getErrorMessage, showErrorToast } from "~/lib/handle-error";
import { sendEmail } from "~/server/services/messaging-service";
import { api } from "~/trpc/react";
import { encryptInvitationCode } from "~/utils/encrypt";
import { SignUpContactIcon } from "./SignUpContactIcon";

export function SignUpContact() {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const studentContactsQuery = api.student.contacts.useQuery(params.id);
  const sendInvite = useCallback(
    async ({ email, username }: { email: string; username: string }) => {
      const invitationCode = await encryptInvitationCode(email);
      const invitationLink =
        env.NEXT_PUBLIC_BASE_URL +
        "/invite/" +
        invitationCode +
        "?email=" +
        email;
      const emailHtml = render(
        <SendInvite
          username={username}
          invitedByUsername="Admin"
          invitedByEmail="support@discolaire.com"
          schoolName="Portal Scoalire"
          inviteLink={invitationLink}
        />,
      );
      toast.promise(
        sendEmail({
          subject: "Invitation to join Discolaire",
          to: email,
          body: emailHtml,
        }),
        {
          loading: t("sending..."),
          success: () => {
            return t("sent_successfully");
          },
          error: (error) => {
            return getErrorMessage(error);
          },
        },
      );
    },
    [t],
  );
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
  if (!studentContactsQuery.data) {
    return <EmptyState className="my-4" />;
  }
  const haveNotSignedUp = studentContactsQuery.data.map(
    (std) => !std.contact.userId,
  ).length;
  if (haveNotSignedUp == 0) {
    return;
  }
  return (
    <div className="flex flex-row gap-4 px-4 pt-2 text-sm">
      <div className="flex w-full flex-col rounded-xl border border-[#f3ba63] bg-[#fff9ed] p-4 text-accent-foreground dark:border-[#693f05] dark:bg-[#271700]">
        <div className="flex flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <div className="color-gray-900 text-md flex w-full flex-row justify-between font-bold">
              {haveNotSignedUp == 1
                ? t("contact_has_not_signed_up", {
                    n: haveNotSignedUp,
                  })
                : t("contacts_have_not_signed_up", {
                    n: haveNotSignedUp,
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
                onClick={() => {
                  studentContactsQuery.data.forEach(async (std) => {
                    if (!std.contact.email) {
                      toast.error(
                        t("email_not_found") +
                          " " +
                          std.contact.firstName +
                          " " +
                          std.contact.lastName,
                      );
                      return;
                    }
                    await sendInvite({
                      email: std.contact.email,
                      username:
                        std.contact.lastName ||
                        std.contact.firstName ||
                        "@username",
                    });
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                  });
                }}
                variant={"default"}
                className="w-fit"
                size={"sm"}
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
