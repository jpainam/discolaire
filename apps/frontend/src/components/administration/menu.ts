export const pageHeaderBreadcrumbs: Record<
  string,
  { title: string; url?: string }[]
> = {
  "/administration/my-school": [
    {
      title: "my_school",
      url: "/administration/my-school",
    },
  ],
  "/administration/courses": [
    {
      title: "my_school",
      url: "/administration/my-school",
    },
    {
      title: "courses",
      url: "/administration/courses",
    },
  ],
  "/administration/classrooms": [
    {
      title: "my_school",
      url: "/administration/my-school",
    },
    {
      title: "classrooms",
      url: "/administration/classrooms",
    },
  ],
  "/administration/accounting/transactions": [
    {
      title: "finances",
      url: "/administration/accounting",
    },
    {
      title: "transactions",
      url: "/administration/accounting/transactions",
    },
  ],
  "/administration/sms_emails": [
    {
      title: "communications",
      url: "/administration/sms-emails",
    },
    {
      title: "sms_and_emails",
      url: "/administration/sms-emails",
    },
  ],
};
