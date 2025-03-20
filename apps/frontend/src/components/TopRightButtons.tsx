"use client";

import { CircleHelp, Mail } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { SimpleTooltip } from "~/components/simple-tooltip";
import { useRouter } from "~/hooks/use-router";
import { useSession } from "~/providers/AuthProvider";
import { FeedBackDialog } from "./FeedbackDialog";

export function TopRightButtons() {
  const { openModal } = useModal();
  //const isActive = false;
  const session = useSession();
  const router = useRouter();
  const { t } = useLocale("description");
  return (
    <>
      <SimpleTooltip content="Dialoguer">
        <Button
          onClick={() => {
            router.push(`/users/${session.user?.id}/mails`);
          }}
          className="size-8"
          size={"icon"}
          aria-label="Message"
          variant="ghost"
        >
          <Mail className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Feedback">
        <Button
          className="size-8"
          size={"icon"}
          aria-label="Feedback"
          variant="ghost"
          onClick={() => {
            openModal({
              title: (
                <span className="p-4 text-2xl font-semibold">
                  {t("Feedback")}
                </span>
              ),

              className: "w-[400px] py-4 px-0",
              view: <FeedBackDialog />,
            });
          }}
        >
          <CircleHelp className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
    </>
  );
}
