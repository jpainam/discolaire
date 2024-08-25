import { getServerTranslations } from "@repo/i18n/server";

import { ProgramHeader } from "~/components/classrooms/programs/ProgramHeader";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <div className="flex flex-col">
      <ProgramHeader />
      Detail du program
    </div>
  );
}
