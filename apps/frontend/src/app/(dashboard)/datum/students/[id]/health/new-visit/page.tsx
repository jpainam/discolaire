import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/components/EmptyState";

import { CreateEditHealthVisit } from "~/components/students/health/CreateEditHealthVisit";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await api.student.get(params.id);
  const { t } = await getServerTranslations();
  if (!student.userId) {
    return (
      <EmptyState
        className="py-8"
        title={t("no_user_attached_to_the_student")}
      />
    );
  }

  return (
    <div>
      <CreateEditHealthVisit userId={student.userId} />
    </div>
  );
}
