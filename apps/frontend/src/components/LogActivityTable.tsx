import { formatDistanceToNow } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";

import type { RouterOutputs } from "@repo/api";
import { cn } from "@repo/ui/lib/utils";

import { getServerTranslations } from "~/i18n/server";
import { EmptyState } from "./EmptyState";

export async function LogActivityTable({
  logs,
}: {
  logs: RouterOutputs["logActivity"]["user"];
}) {
  const { t, i18n } = await getServerTranslations();

  return (
    <div className="max-h-[calc(100vh-5rem)] space-y-3 overflow-y-auto">
      {logs.length === 0 && (
        <EmptyState className="my-8" title={t("no_data")} />
      )}
      {logs.map((log, index) => (
        <div
          key={index}
          className={cn(
            "hover:bg-muted border-l-2 border-amber-500 p-2 pl-3 text-xs transition-colors",
            log.action === "delete" && "border-red-500",
            log.action === "create" && "border-green-500",
            log.action === "update" && "border-orange-500",
            log.action === "read" && "border-blue-500",
          )}
        >
          <div className="font-mono text-neutral-500">
            {formatDistanceToNow(log.createdAt, {
              locale:
                i18n.language == "fr" ? fr : i18n.language == "en" ? enUS : es,
            })}
          </div>
          <div className="">
            {t("The user")}{" "}
            <span className="font-mono text-orange-500">
              {log.user?.name ?? "system"}
            </span>{" "}
            <span className="lowercase">{t(getActionString(log.action))} </span>
            <span className="font-mono lowercase">un/une {t(log.entity)}</span>
            {log.entityId && (
              <span>
                {" "}
                correspondant à{" "}
                <span className="font-mono text-orange-500">
                  {log.entityId} {log.metadata && JSON.stringify(log.metadata)}
                </span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function getActionString(action: string) {
  switch (action) {
    case "create":
      return "has created";
    case "update":
      return "has updated";
    case "delete":
      return "has deleted";
    case "read":
      return "has read";
    default:
      return action;
  }
}
