import { PencilIcon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { useModal } from "@repo/lib/hooks/use-modal";

import { getFullName } from "~/utils/full-name";
import { AvatarState } from "../AvatarState";
import { SimpleTooltip } from "../simple-tooltip";
import { Button } from "../ui/button";
import { ChangeAvatar } from "./ChangeAvatar";

export function SquaredAvatar({ student }: { student?: any }) {
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
                title: "Upload files",
                className: "w-[500px]",
                description:
                  "Drag and drop your files here or click to browse.",
                view: <ChangeAvatar studentId={student?.id} />,
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
