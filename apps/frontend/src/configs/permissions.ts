export enum PermissionAction {
  Read = "Read",
  Write = "Write",
  Delete = "Delete",
  Update = "Update",
}

export const permissions: {
  title: string;
  permission: string;
}[] = [
  {
    title: "classrooms",
    permission: "classroom",
  },
  { title: "students", permission: "student" },
  { title: "staffs", permission: "staff" },
  { title: "contacts", permission: "contact" },
];
