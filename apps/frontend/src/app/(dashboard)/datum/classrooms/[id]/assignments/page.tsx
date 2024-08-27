// 'use client' PLease AVOID MAKING Pages as CLIENT
import { AssignmentDataTable } from "~/components/classrooms/assignments/AssignmentDataTable";
import { AssignmentHeader } from "~/components/classrooms/assignments/AssignmentHeader";
import { api } from "~/trpc/server";

interface AssignmentPageProps {
  searchParams: {
    per_page: number;
  };
  params: {
    id: string;
  };
}
export default async function Page({
  params,
  searchParams,
}: AssignmentPageProps) {
  const assignemts = await api.classroom.assignments(params.id);
  // const handleTitleClick = (id: string) => {
  //   router.push(
  //     routes.classrooms.assignments.edit(
  //       "668f0547-3bb2-4543-8265-60c9e21c5344",
  //       id
  //     )
  //   );
  // };
  return (
    <div className="flex w-full flex-col">
      <AssignmentHeader />
      <AssignmentDataTable assignments={assignemts} />
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Title</th>
              <th className="border-b px-4 py-2">Due Date</th>
              <th className="border-b px-4 py-2">Visible to Parents</th>
            </tr>
          </thead>
          <tbody>
            {assignemts.map((assignment) => (
              <tr key={assignment.id}>
                <td
                  className="cursor-pointer border-b px-4 py-2 text-blue-500"
                  //onClick={() => handleTitleClick(assignment.id)}
                >
                  {assignment.title}
                </td>
                <td className="border-b px-4 py-2">
                  {assignment.dueDate &&
                    new Date(assignment.dueDate).toLocaleDateString()}
                </td>
                <td className="border-b px-4 py-2">
                  {assignment.visibles ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
