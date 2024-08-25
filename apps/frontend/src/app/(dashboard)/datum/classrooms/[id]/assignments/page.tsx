// 'use client' PLease AVOID MAKING Pages as CLIENT
import { AssignmentDataTable } from "@/components/classrooms/assignments/AssignmentDataTable";
import { AssignmentHeader } from "@/components/classrooms/assignments/AssignmentHeader";
import { api } from "@/trpc/server";

type AssignmentPageProps = {
  searchParams: {
    per_page: number;
  };
  params: {
    id: string;
  };
};
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
        <table className="min-w-full dark:bg-gray-800 bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Due Date</th>
              <th className="py-2 px-4 border-b">Visible to Parents</th>
            </tr>
          </thead>
          <tbody>
            {assignemts.map((assignment) => (
              <tr key={assignment.id}>
                <td
                  className="py-2 px-4 border-b text-blue-500 cursor-pointer"
                  //onClick={() => handleTitleClick(assignment.id)}
                >
                  {assignment.title}
                </td>
                <td className="py-2 px-4 border-b">
                  {assignment.dueDate &&
                    new Date(assignment.dueDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
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
