"use client";

import { ActivityIcon, CircleHelp, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { authClient } from "~/auth/client";
import { SimpleTooltip } from "~/components/simple-tooltip";
import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/use-modal";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { FeedBackDialog } from "./FeedbackDialog";
import { UserLog } from "./UserLogs";

export function TopRightButtons() {
  const { openModal } = useModal();
  //const isActive = false;
  const { openSheet } = useSheet();
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const t = useTranslations("description");
  return (
    <div className="hidden items-center gap-1 md:flex">
      <SimpleTooltip content="Messages">
        <Button
          onClick={() => {
            router.push(`/users/${session?.user.id}/mails`);
          }}
          className="size-7"
          size={"icon"}
          aria-label="Message"
          variant="ghost"
        >
          <Mail className="h-3 w-3" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Activity">
        <Button
          className="size-7"
          size={"icon"}
          aria-label="Feedback"
          variant="ghost"
          onClick={() => {
            openSheet({
              className: "w-[700px] py-4 px-4",
              title: t("activities"),
              view: <UserLog />,
            });
          }}
        >
          <ActivityIcon className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Feedback">
        <Button
          className="size-7"
          size={"icon"}
          aria-label="Feedback"
          variant="ghost"
          onClick={() => {
            openModal({
              title: t("Feedback"),
              view: <FeedBackDialog />,
            });
          }}
        >
          <CircleHelp className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
    </div>
  );
}
