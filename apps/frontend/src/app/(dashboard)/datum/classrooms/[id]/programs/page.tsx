import { getServerTranslations } from "~/app/i18n/server";
import { EmptyState } from "~/components/EmptyState";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-2 text-xs text-secondary-foreground 2xl:text-sm">
        {t("programs")}
      </div>
      <br />
      <EmptyState />
    </div>
  );
}
