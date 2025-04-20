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
    title: "contacts",
    resource: "contact",
    action: PermissionAction.Read,
  },
  {
    title: "contacts",
    resource: "contact",
    action: PermissionAction.Update,
  },
  {
    title: "contacts",
    resource: "contact",
    action: PermissionAction.Create,
  },
  {
    title: "contacts",
    resource: "contact",
    action: PermissionAction.Delete,
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
  {
    title: "library",
    resource: "library",
    action: PermissionAction.Read,
  },
  {
    title: "library",
    resource: "library",
    action: PermissionAction.Update,
  },
  {
    title: "library",
    resource: "library",
    action: PermissionAction.Create,
  },
  {
    title: "library",
    resource: "library",
    action: PermissionAction.Delete,
  },
  {
    title: "gradesheets",
    resource: "gradesheet",
    action: PermissionAction.Read,
  },
  {
    title: "gradesheets",
    resource: "gradesheet",
    action: PermissionAction.Update,
  },
  {
    title: "gradesheets",
    resource: "gradesheet",
    action: PermissionAction.Create,
  },
  {
    title: "gradesheets",
    resource: "gradesheet",
    action: PermissionAction.Delete,
  },
  {
    title: "attendance",
    resource: "attendance",
    action: PermissionAction.Read,
  },
  {
    title: "attendance",
    resource: "attendance",
    action: PermissionAction.Update,
  },
  {
    title: "attendance",
    resource: "attendance",
    action: PermissionAction.Create,
  },
  {
    title: "attendance",
    resource: "attendance",
    action: PermissionAction.Delete,
  },
  {
    title: "reportcards",
    resource: "reportcard",
    action: PermissionAction.Read,
  },
  {
    title: "reportcards",
    resource: "reportcard",
    action: PermissionAction.Update,
  },
  {
    title: "reportcard",
    resource: "reportcard",
    action: PermissionAction.Create,
  },
  {
    title: "reportcard",
    resource: "reportcard",
    action: PermissionAction.Delete,
  },
  {
    title: "policy",
    resource: "policy",
    action: PermissionAction.Read,
  },
  {
    title: "policy",
    resource: "policy",
    action: PermissionAction.Update,
  },
  {
    title: "policy",
    resource: "policy",
    action: PermissionAction.Create,
  },
  {
    title: "policy",
    resource: "policy",
    action: PermissionAction.Delete,
  },
  {
    title: "user",
    resource: "user",
    action: PermissionAction.Read,
  },
  {
    title: "user",
    resource: "user",
    action: PermissionAction.Update,
  },
  {
    title: "user",
    resource: "user",
    action: PermissionAction.Create,
  },
  {
    title: "user",
    resource: "user",
    action: PermissionAction.Delete,
  },
  {
    title: "assignment",
    resource: "assignment",
    action: PermissionAction.Read,
  },
  {
    title: "assignment",
    resource: "assignment",
    action: PermissionAction.Update,
  },
  {
    title: "assignment",
    resource: "assignment",
    action: PermissionAction.Delete,
  },
  {
    title: "assignment",
    resource: "assignment",
    action: PermissionAction.Create,
  },
  {
    title: "timetable",
    resource: "timetable",
    action: PermissionAction.Read,
  },
  {
    title: "timetable",
    resource: "timetable",
    action: PermissionAction.Update,
  },
  {
    title: "timetable",
    resource: "timetable",
    action: PermissionAction.Create,
  },
  {
    title: "timetable",
    resource: "timetable",
    action: PermissionAction.Delete,
  },
  {
    title: "subscription",
    resource: "subscription",
    action: PermissionAction.Read,
  },
  {
    title: "subscription",
    resource: "subscription",
    action: PermissionAction.Delete,
  },
  {
    title: "subscription",
    resource: "subscription",
    action: PermissionAction.Create,
  },
  {
    title: "subscription",
    resource: "subscription",
    action: PermissionAction.Update,
  },
];

export const menuPolicies: {
  title: string;
  resource: string;
  action: PermissionAction;
}[] = [
  {
    title: "administration",
    resource: "menu:administration",
    action: PermissionAction.Read,
  },
  {
    title: "library",
    resource: "menu:library",
    action: PermissionAction.Read,
  },
  {
    title: "staff",
    resource: "menu:staff",
    action: PermissionAction.Read,
  },
];
