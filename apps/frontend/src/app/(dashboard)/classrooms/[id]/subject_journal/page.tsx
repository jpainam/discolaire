import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { api, caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const subjects = await api.classroom.subjects(id);
  if (subjects.length == 0) {
    return <EmptyState className="m-8" />;
  }
  const { t } = await getServerTranslations();

  const journals = await caller.subjectJournal.all({ limit: 20 });
  if (journals.length == 0) {
    return <EmptyState className="m-8" title={t("no_data")} />;
  }

  return (
    <div className="flex flex-col gap-4 p-4 mb-8">
      {journals.map((journal, index) => {
        return (
          <div key={index}>
            <div className="flex justify-between items-start ">
              <div className="flex">
                <div className="w-1 bg-orange-400 mr-4 rounded-full"></div>
                <div>
                  <h3 className="font-bold  uppercase">
                    {journal.subject.course.name}
                  </h3>
                  <p className="text-muted-foreground text-xs">M. DEJEAN Y.</p>
                </div>
              </div>
              <div className="text-muted-foreground text-xs">
                {" "}
                15 Jan 2025 13h30 à 14h30
              </div>
            </div>
            <div className="flex justify-between ml-6">
              <div>
                <p className="text-md">
                  Identifier le(s) matériau(x), les flux d'énergie et
                  d'information sur un objet et décrire les transformations qui
                  s'opèrent
                </p>
                <p className="text-muted-foreground text-sm">
                  Familles de matériaux avec leurs principales caractéristiques
                </p>
                <p className="text-muted-foreground text-sm">
                  Sources d'énergies
                </p>
                <p className="text-muted-foreground text-sm">
                  Chaîne d'énergie
                </p>
                <p className="text-muted-foreground text-sm">
                  Chaîne d'information
                </p>
              </div>
              <div className="bg-secondary px-4 py-1 text-sm rounded-xl border text-secondary-foreground h-fit">
                Cours
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
