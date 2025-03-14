export enum PermissionAction {
  Read = "Read",
  Create = "Create",
  Delete = "Delete",
  Update = "Update",
}

export const policies: {
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
    action: PermissionAction.Create,
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
    action: PermissionAction.Create,
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
    action: PermissionAction.Create,
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
    action: PermissionAction.Create,
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
    action: PermissionAction.Create,
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
    action: PermissionAction.Create,
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
    action: PermissionAction.Create,
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
