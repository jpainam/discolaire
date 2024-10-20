import Link from "next/link";

import { api } from "~/trpc/server";

export async function SubjectList({ classroomId }: { classroomId: string }) {
  const subjects = await api.classroom.subjects({ id: classroomId });
  //const { t } = await getServerTranslations();
  return (
    <div className="overflow-y-auto border-r bg-muted/50 text-sm">
      {/* <h2 className="mb-4 text-xl font-bold">{t("courses")}</h2> */}
      <ul>
        {subjects.map((subject, index) => (
          <li key={index} className={`cursor-pointer p-2 hover:bg-secondary`}>
            <Link
              className="rounded-lg p-2 hover:text-blue-700 hover:underline"
              href={`/datum/classrooms/${classroomId}/subject-journal/${subject.id}`}
            >
              {subject.course.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
