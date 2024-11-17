import {
  CalendarDays,
  CircleDollarSign,
  SchoolIcon,
  Settings,
  Users,
} from "lucide-react";

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
};
export const adminMenu = {
  navMain: [
    {
      title: "my_school",
      url: "/administration/my-school",
      icon: SchoolIcon,

      items: [
        {
          title: "my_school",
          url: "/administration/my-school",
        },
        {
          title: "courses",
          url: "/administration/courses",
        },
        {
          title: "classroom_settings",
          url: "/administration/classrooms",
        },
        {
          title: "directory",
          url: "/administration/directory",
        },
      ],
    },
    {
      title: "Finances",
      url: "#",
      icon: CircleDollarSign,
      //isActive: true,
      items: [
        {
          title: "Frais",
          url: "/administration/accounting/fees",
        },
        {
          title: "Transactions",
          url: "/administration/accounting/transactions",
        },
        {
          title: "Groupes",
          url: "/administration/accounting/groups",
        },
        {
          title: "settings",
          url: "/administration/accounting/settings",
        },
      ],
    },
    {
      title: "Utilisateurs",
      url: "/administration/users",
      icon: Users,
      items: [
        {
          title: "Liste",
          url: "/administration/users",
        },
        {
          title: "Roles",
          url: "/administration/users/roles",
        },
        {
          title: "Permissions",
          url: "/administration/users/policies",
        },
      ],
    },
    {
      title: "schoolYear",
      url: "/administration/school-years",
      icon: CalendarDays,
      items: [
        {
          title: "schoolYear",
          url: "/administration/school-years",
        },
        {
          title: "periods",
          url: "/administration/school-years/terms",
        },
      ],
    },
    {
      title: "settings",
      url: "/administration/settings",
      icon: Settings,
      items: [
        {
          title: "grade_options",
          url: "/administration/settings/grade-options",
        },
        {
          title: "religions",
          url: "/administration/settings/religions",
        },
        {
          title: "sports",
          url: "/administration/settings/sports",
        },
        {
          title: "clubs",
          url: "/administration/settings/clubs",
        },
        {
          title: "former_schools",
          url: "/administration/settings/former-schools",
        },
        {
          title: "staff_level",
          url: "/administration/settings/staff-levels",
        },
      ],
    },
  ],
};
