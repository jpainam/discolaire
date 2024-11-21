import { redirect } from "next/navigation";

import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";

import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const { t } = await getServerTranslations();
  const subjects = await api.classroom.subjects(id);
  const subject = subjects.length > 0 ? subjects[0] : null;
  if (subject) {
    redirect(`/datum/classrooms/${id}/programs/${subject.id}`);
  }
  return (
    <EmptyState
      className="my-8"
      title={t("to_get_started")}
      description={t("select_a_subject")}
    />
  );
}
