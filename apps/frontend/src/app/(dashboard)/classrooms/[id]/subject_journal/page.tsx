import { EmptyState } from "~/components/EmptyState";

import { api, caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const subjects = await api.classroom.subjects(id);
  if (subjects.length == 0) {
    return <EmptyState className="m-8" />;
  }

  const journals = await caller.subjectJournal.all({ limit: 20 });
  console.log(journals);
  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div className="flex">
            <div className="w-1.5 bg-orange-400 mr-4 rounded-full"></div>
            <div>
              <h3 className="font-bold text-gray-800 uppercase">TECHNOLOGIE</h3>
              <p className="text-gray-600">M. DEJEAN Y.</p>
            </div>
          </div>
          <div className="text-gray-600">13h30 à 14h30</div>
        </div>
        <div className="flex justify-between ml-6">
          <div>
            <p className="text-gray-800 font-medium mb-2">
              Identifier le(s) matériau(x), les flux d'énergie et d'information
              sur un objet et décrire les transformations qui s'opèrent
            </p>
            <p className="text-gray-700">
              Familles de matériaux avec leurs principales caractéristiques
            </p>
            <p className="text-gray-700">Sources d'énergies</p>
            <p className="text-gray-700">Chaîne d'énergie</p>
            <p className="text-gray-700">Chaîne d'information</p>
          </div>
          <div className="bg-gray-200 px-4 py-1 rounded text-gray-700 h-fit">
            Cours
          </div>
        </div>
      </div>
    </div>
  );
}
