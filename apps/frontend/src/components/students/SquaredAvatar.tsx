import { PencilIcon } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";

import { getFullName } from "~/utils/full-name";
import { AvatarState } from "../AvatarState";
import { SimpleTooltip } from "../simple-tooltip";
import { ChangeAvatar } from "./ChangeAvatar";

type Student = RouterOutputs["student"]["get"];
export function SquaredAvatar({ student }: { student?: Student }) {
  const { t } = useLocale();
  const { openModal } = useModal();

  return (
    <div className="group relative h-[100px] w-[100px]">
      <AvatarState
        className="my-0 h-full w-[100px] rounded-md"
        pos={getFullName(student).length}
        avatar={student?.avatar}
      />
      <div className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100">
        <SimpleTooltip content={t("change_avatar")}>
          <Button
            onClick={() => {
              if (!student?.id) return;
              openModal({
                title: t("upload_files"),
                className: "w-[500px]",
                description: t("upload_files_description"),
                view: <ChangeAvatar studentId={student.id} />,
              });
            }}
            size={"icon"}
            className="h-6 w-6"
            variant="ghost"
          >
            <PencilIcon className="h-3 w-3" />
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
}
