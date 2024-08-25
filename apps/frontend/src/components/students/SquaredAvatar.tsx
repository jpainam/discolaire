import { useLocale } from "@/hooks/use-locale";
import { useModal } from "@/hooks/use-modal";
import { getFullName } from "@/utils/full-name";
import { PencilIcon } from "lucide-react";
import { AvatarState } from "../AvatarState";
import { SimpleTooltip } from "../simple-tooltip";
import { Button } from "../ui/button";
import { ChangeAvatar } from "./ChangeAvatar";

export function SquaredAvatar({ student }: { student?: any }) {
  const { t } = useLocale();
  const { openModal } = useModal();

  return (
    <div className="relative group w-[100px] h-[100px]">
      <AvatarState
        className="w-[100px] h-full rounded-md my-0"
        pos={getFullName(student).length}
        avatar={student?.avatar}
      />
      <div className="absolute top-1  right-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
            className="w-6 h-6"
            variant="ghost"
          >
            <PencilIcon className="w-3 h-3" />
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
}
