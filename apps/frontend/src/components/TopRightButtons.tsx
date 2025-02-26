"use client";

import { CircleHelp, Mail } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { SimpleTooltip } from "~/components/simple-tooltip";
import { FeedBackDialog } from "./FeedbackDialog";

export function TopRightButtons() {
  const { openModal } = useModal();
  //const isActive = false;
  const { t } = useLocale("description");
  return (
    <>
      <SimpleTooltip content="Dialoguer">
        <Button
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
              description: (
                <div className="px-4 text-sm">{t("feedback_description")}</div>
              ),
              className: "w-[600px] py-4 px-0",
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
