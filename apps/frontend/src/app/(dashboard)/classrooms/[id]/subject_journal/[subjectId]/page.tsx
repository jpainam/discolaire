import { Separator } from "@repo/ui/components/separator";

import { auth } from "@repo/auth";
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";
import { SubjectJournalEditor } from "./SubjectJournalEditor";
import { SubjectJournalHeader } from "./SubjectJournalHeader";
import { SubjectJournalList } from "./SubjectJournalList";

export default async function Page(props: {
  params: Promise<{ subjectId: string; pageIndex?: string; pageSize?: string }>;
}) {
  const params = await props.params;

  const { subjectId } = params;

  const subject = await api.subject.get(Number(subjectId));
  const session = await auth();
  const { t } = await getServerTranslations();

  const subjectJournals = await api.subjectJournal.bySubject({
    subjectId: Number(params.subjectId),
    pageIndex: params.pageIndex ? Number(params.pageIndex) : 0,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  });

  return (
    <div className="flex flex-col">
      <SubjectJournalHeader
        subject={{ name: subject.course.name, id: subject.id }}
      />
      {session?.user.profile == "staff" && (
        <>
          <SubjectJournalEditor subjectId={Number(subjectId)} />
          <Separator />
        </>
      )}
      {subjectJournals.length == 0 ? (
        <EmptyState className="my-8" title={t("no_data")} />
      ) : (
        <SubjectJournalList
          journals={subjectJournals}
          subjectId={Number(subjectId)}
        />
      )}
    </div>
  );
}
