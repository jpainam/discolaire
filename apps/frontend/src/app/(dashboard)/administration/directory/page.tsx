import { getServerTranslations } from "@repo/i18n/server";

import { api } from "~/trpc/server";
import { PageHeader } from "../PageHeader";
import DirectoryHeader from "./DirectoryHeader";
import { DirectoryTable } from "./DirectoryTable";

export default async function Page(props: { searchParams: { q: string } }) {
  c;
  const directories = await api.directory.all({ q: q });

  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={t("directory")}>
        <DirectoryHeader />
      </PageHeader>
      <DirectoryTable directories={directories} />
    </div>
  );
}
