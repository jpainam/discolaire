import { getServerTranslations } from "@/app/i18n/server";
import { EmptyState } from "@/components/EmptyState";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col">
      <div className="flex flex-row 2xl:text-sm items-center gap-2 px-2 py-2 bg-secondary text-secondary-foreground border-b text-xs">
        {t("programs")}
      </div>
      <br />
      <EmptyState />
    </div>
  );
}
