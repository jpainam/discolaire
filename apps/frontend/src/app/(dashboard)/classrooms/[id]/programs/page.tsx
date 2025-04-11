import { redirect } from "next/navigation";

import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const { t } = await getServerTranslations();
  const subjects = await caller.classroom.subjects(id);
  const subject = subjects.length > 0 ? subjects[0] : null;
  if (subject) {
    redirect(`/classrooms/${id}/programs/${subject.id}`);
  }
  return (
    <EmptyState
      className="my-8"
      title={t("to_get_started")}
      description={t("select_a_subject")}
    />
  );
}
