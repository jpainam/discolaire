export const activityTypes = {
  CREATE_USER: "created a user",
  DELETE_USER: "deleted a user",
  UPDATE_USER: "updated a user",
  CREATE_STUDENT: "created a student",
  DELETE_STUDENT: "deleted a student",
  UPDATE_STUDENT: "updated a student",
} as const;

export type ActivityType = (typeof activityTypes)[keyof typeof activityTypes];
