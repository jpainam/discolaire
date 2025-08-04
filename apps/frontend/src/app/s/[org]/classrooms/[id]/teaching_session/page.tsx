import i18next from "i18next";

import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";
import { isRichText } from "~/lib/utils";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const subjects = await caller.classroom.subjects(id);
  if (subjects.length == 0) {
    return <EmptyState className="m-8" />;
  }
  const { t } = await getServerTranslations();

  const journals = await caller.teachingSession.all({ limit: 20 });
  if (journals.length == 0) {
    return <EmptyState className="m-8" title={t("no_data")} />;
  }

  return (
    <div className="mb-8 flex flex-col gap-4 p-4">
      {journals.map((journal, index) => {
        return (
          <div key={index}>
            <div className="flex items-start justify-between">
              <div className="flex">
                <div
                  className="mr-1 w-1.5 rounded-full"
                  style={{
                    backgroundColor: "red", //journal.subject.course.color,
                  }}
                ></div>
                {/* <div className="w-1 bg-orange-400 mr-4 rounded-full"></div> */}
                <div>
                  <p className="text-lg font-bold uppercase">
                    Maths
                    {/* {journal.subject.course.name} */}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Mr Dupont Piere
                    {/* {journal.subject.teacher?.prefix}{" "}
                    {journal.subject.teacher?.lastName} */}
                  </p>
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                {journal.createdAt.toLocaleTimeString(i18next.language, {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="ml-6 flex justify-between">
              {isRichText(journal.content) ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: journal.content,
                  }}
                ></div>
              ) : (
                <div className="">{journal.content}</div>
              )}
              <div className="bg-secondary text-secondary-foreground h-fit rounded-xl border px-4 py-1 text-sm">
                Cours
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
