export enum PermissionAction {
  Read = "Read",
  Write = "Write",
  Delete = "Delete",
  Update = "Update",
}

export const permissions: {
  title: string;
  resource: string;
  action: PermissionAction;
}[] = [
  {
    title: "classrooms",
    resource: "classroom",
    action: PermissionAction.Read,
  },
  {
    title: "classrooms",
    resource: "classroom",
    action: PermissionAction.Write,
  },
  {
    title: "classrooms",
    resource: "classroom",
    action: PermissionAction.Delete,
  },
  {
    title: "classrooms",
    resource: "classroom",
    action: PermissionAction.Update,
  },
  {
    title: "students",
    resource: "student",
    action: PermissionAction.Read,
  },
  {
    title: "students",
    resource: "student",
    action: PermissionAction.Write,
  },
  {
    title: "students",
    resource: "student",
    action: PermissionAction.Delete,
  },
  {
    title: "students",
    resource: "student",
    action: PermissionAction.Update,
  },
  {
    title: "staffs",
    resource: "staff",
    action: PermissionAction.Read,
  },
  {
    title: "staffs",
    resource: "staff",
    action: PermissionAction.Write,
  },
  {
    title: "staffs",
    resource: "staff",
    action: PermissionAction.Delete,
  },
  {
    title: "staffs",
    resource: "staff",
    action: PermissionAction.Update,
  },
  {
    title: "all_subjects",
    resource: "subject",
    action: PermissionAction.Read,
  },
  {
    title: "all_subjects",
    resource: "subject",
    action: PermissionAction.Write,
  },
  {
    title: "all_subjects",
    resource: "subject",
    action: PermissionAction.Delete,
  },
  {
    title: "all_subjects",
    resource: "subject",
    action: PermissionAction.Update,
  },
  {
    title: "enrollments",
    resource: "enrollment",
    action: PermissionAction.Read,
  },
  {
    title: "enrollments",
    resource: "enrollment",
    action: PermissionAction.Write,
  },
  {
    title: "enrollments",
    resource: "enrollment",
    action: PermissionAction.Delete,
  },
  {
    title: "enrollments",
    resource: "enrollment",
    action: PermissionAction.Update,
  },
  {
    title: "school_fees",
    resource: "fee",
    action: PermissionAction.Read,
  },
  {
    title: "school_fees",
    resource: "fee",
    action: PermissionAction.Write,
  },
  {
    title: "school_fees",
    resource: "fee",
    action: PermissionAction.Delete,
  },
  {
    title: "school_fees",
    resource: "fee",
    action: PermissionAction.Update,
  },
  {
    title: "transactions",
    resource: "transaction",
    action: PermissionAction.Read,
  },
  {
    title: "transactions",
    resource: "transaction",
    action: PermissionAction.Write,
  },
  {
    title: "transactions",
    resource: "transaction",
    action: PermissionAction.Delete,
  },
  {
    title: "transactions",
    resource: "transaction",
    action: PermissionAction.Update,
  },
];
