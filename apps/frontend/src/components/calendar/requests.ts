import { caller } from "~/trpc/server";
import { CALENDAR_ITENS_MOCK } from "./mocks";

export const getEvents = async () => {
  // Increase the delay to better see the loading state
  await new Promise((resolve) => setTimeout(resolve, 800));
  return CALENDAR_ITENS_MOCK;
};

export const getUsers = async ({ classroomId }: { classroomId: string }) => {
  // Increase the delay to better see the loading state

  return caller.classroom.teachers(classroomId);
};
