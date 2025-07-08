import type { RouterOutputs } from "@repo/api";
import { cn } from "@repo/ui/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { getServerTranslations } from "~/i18n/server";
import { EmptyState } from "./EmptyState";
export async function LogActivityTable({
  logs,
}: {
  logs: RouterOutputs["logActivity"]["all"];
}) {
  const { t, i18n } = await getServerTranslations();

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {logs.length === 0 && (
        <EmptyState className="my-8" title={t("no_data")} />
      )}
      {logs.map((log, index) => (
        <div
          key={index}
          className={cn(
            "text-xs border-l-2 pl-3 border-amber-500 hover:bg-neutral-800 p-2 transition-colors",
            log.action === "delete" && "border-red-500",
            log.action === "create" && "border-green-500",
            log.action === "update" && "border-orange-500",
            log.action === "read" && "border-blue-500",
          )}
        >
          <div className="text-neutral-500 font-mono">
            Il y'a{" "}
            {formatDistanceToNow(log.createdAt, {
              locale:
                i18n.language == "fr" ? fr : i18n.language == "en" ? enUS : es,
            })}
          </div>
          <div className="">
            {t("The user")}{" "}
            <span className="text-orange-500 font-mono">
              {log.user?.name ?? "system"}
            </span>{" "}
            <span className="lowercase">{t(getActionString(log.action))} </span>
            <span className=" font-mono lowercase">un/une {t(log.entity)}</span>
            {log.entityId && (
              <span>
                {" "}
                sur l'entité{" "}
                <span className="text-orange-500 font-mono">
                  {log.entityId}
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
