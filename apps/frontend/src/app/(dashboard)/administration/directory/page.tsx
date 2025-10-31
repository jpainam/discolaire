import { Label } from "@repo/ui/components/label";

import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import DirectoryHeader from "./DirectoryHeader";
import { DirectoryTable } from "./DirectoryTable";

export default async function Page(props: {
  searchParams: Promise<{ q: string }>;
}) {
  const searchParams = await props.searchParams;
  const directories = await caller.directory.all({ q: searchParams.q });

  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <Label>{t("directory")}</Label>
        <DirectoryHeader />
      </div>
      <DirectoryTable directories={directories} />
    </div>
  );
}
