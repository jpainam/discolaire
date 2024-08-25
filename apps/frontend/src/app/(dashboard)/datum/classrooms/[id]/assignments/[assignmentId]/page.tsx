import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Page({
  params: { id, assignmentId },
}: {
  params: { id: string; assignmentId: string };
}) {
  const assignment = await api.assignment.get(assignmentId);
  if (!assignment) {
    notFound();
  }
  return <div>{JSON.stringify(assignment)}</div>;
}
