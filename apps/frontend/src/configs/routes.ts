export const routes = {
  privacy_policy: "/privacy-policy",
  terms_of_service: "/terms-of-service",
  users: {
    index: "/users",
    roles: (id: string) => `/users/${id}/roles`,
    logs: (id: string) => `/users/${id}/logs`,
    details: (id: string) => `/users/${id}`,
    profile: (id: string) => `/users/${id}/profile`,
    password: (id: string) => `/users/${id}/password`,
    notifications: (id: string) => `/users/${id}/notifications`,
    settings: (id: string) => `/users/${id}/settings`,
  },
  assignments: {
    index: "/datum/assignments",
    details: (id: string) => `/datum/assignments/${id}`,
  },
  staffs: {
    index: `/datum/staffs`,
    payroll: (id: string) => `/datum/staffs/${id}/payroll`,
    documents: (id: string) => `/datum/staffs/${id}/documents`,
    timetables: (id: string) => `/datum/staffs/${id}/timetables`,
    details: (id: string) => `/datum/staffs/${id}`,
  },
  report_cards: {
    index: "/report-cards",
    transcripts: "/report-cards/transcripts",
    appreciations: "/report-cards/appreciations",
    charts: "/report-cards/charts",
  },
  timetables: {
    index: "/datum/timetables",
  },
  datum: {
    index: "/datum",
  },
  auth: {
    login: `/auth/login`,
    logout: `/auth/logout`,
    forgotPassword: `/auth/password/forgot`,
  },

  reports: {
    index: "/reports",
    students: "/reports/students",
    classrooms: "/reports/classrooms",
    staffs: "/reports/staffs",
  },

  subjects: {
    index: "/datum/subjects",
    details: (id: string) => `/datum/subjects/${id}`,
  },

  programs: {
    index: "/programs",
    summary: "/programs/summary",
    homeworks: "/programs/homeworks",
    create: "/programs/create",
    monitoring: "/programs/monitoring",
  },
  contacts: {
    index: "/datum/contacts",
    details: (id: string) => `/datum/contacts/${id}`,
    edit: (id: string) => `/datum/contacts/${id}/?edit=true`,
  },
  email: {
    index: "/email",
  },
  students: {
    index: "/datum/students",
    health: {
      index: (id: string) => `/datum/students/${id}/health`,
      immunizations: (id: string) =>
        `/datum/students/${id}/health/immunizations`,
      health_issues: (id: string) =>
        `/datum/students/${id}/health/health_issues`,
      drugs: (id: string) => `/datum/students/${id}/health/drugs`,
      documents: (id: string) => `/datum/students/${id}/health/documents`,
    },

    attendances: {
      index: (id: string) => `/datum/students/${id}/attendances`,
      periodic: (id: string) => `/datum/students/${id}/attendances/periodic`,
      justifications: (id: string) =>
        `/datum/students/${id}/attendances/justifications`,
      summary: (id: string) => `/datum/students/${id}/attendances/summary`,
    },
    info: {
      index: (id: string) => `/datum/students/${id}`,
      contacts: (id: string) => `/datum/students/${id}/contacts`,
    },

    notifications: (id: string) => `/datum/students/${id}/notifications`,
    contacts: (id: string) => `/datum/students/${id}/contacts`,
    print: (id: string) => `/datum/students/${id}/print`,
    transactions: {
      create: (id: string) => `/datum/students/${id}/transactions/create`,
      index: (id: string) => `/datum/students/${id}/transactions`,
      managePlan: (id: string) => `/datum/students/${id}/account/manage-plan`,
      details: (studentId: string, transactionId: number) =>
        "/datum/students/" + studentId + "/transactions/" + transactionId,
    },
    details: (id: string) => `/datum/students/${id}`,
    edit: (id: string) => `/datum/students/${id}/edit`,
    create: `/datum/students/create`,
    gradesheets: (id: string) => `/datum/students/${id}/gradesheets`,
    grades: (id: string) => `/datum/students/${id}/grades`,
    studentReportCard: (id: string) => `/datum/students/${id}/student-report`,
    classroomReportCard: (id: string) =>
      `/datum/students/${id}/classroom-report`,
    studentGraph: (id: string) => `/datum/students/${id}/student-graph`,
    classroomGraph: (id: string) => `/datum/students/${id}/classroom-graph`,
  },
  classrooms: {
    index: "/datum/classrooms",
    assignments: {
      index: (id: string) => `/datum/classrooms/${id}/assignments`,
      create: (id: string) => `/datum/classrooms/${id}/assignments/create`,
      edit: (id: string, assignmentId: string) =>
        `/datum/classrooms/${id}/assignments/${assignmentId}/edit`,
      details: (id: string, assignmentId: string) =>
        `/datum/classrooms/${id}/assignments/${assignmentId}`,
    },
    finances: (id: string) => `/datum/classrooms/${id}/finances`,
    details: (id: string) => `/datum/classrooms/${id}`,
    edit: (id: string) => `/datum/classrooms/${id}/?edit=true`,
    subjects: (id: string) => `/datum/classrooms/${id}/subjects`,
    attendances: {
      index: (id: string) => `/datum/classrooms/${id}/attendances`,
      periodic: (id: string) => `/datum/classrooms/${id}/attendances/periodic`,
      weekly: (id: string) => `/datum/classrooms/${id}/attendances/weekly`,
      hourly: (id: string) => `/datum/classrooms/${id}/attendances/hourly`,
      digital: (id: string) => `/datum/classrooms/${id}/attendances/digital`,
    },
    programs: (id: string) => `/datum/classrooms/${id}/programs`,
    gradesheets: {
      index: (id: string) => `/datum/classrooms/${id}/gradesheets`,
      details: (id: string, gradeId: number) =>
        `/datum/classrooms/${id}/gradesheets/${gradeId}`,
      edit: (id: string, gradeId: number) =>
        `/datum/classrooms/${id}/gradesheets/${gradeId}/?edit=true`,
      create: (id: string) => `/datum/classrooms/${id}/gradesheets/create`,
    },
  },
  administration: {
    schools: {
      index: "/administration/schools",
      details: (id: string) => `/administration/schools/${id}`,
    },
    my_school: {
      index: `/administration/my-school`,
      details: (id: string) => `/administration/my-school/${id}`,
    },
    subjects: {
      index: "/administration/subjects",
      details: (id: string) => `/
      /subjects/${id}`,
    },
    sms_management: {
      details: (id: number) => `/administration/sms-management/${id}`,
      history: "/administration/sms-management",
      templates: "/administration/sms-management/templates",
      to_parents: "/administration/sms-management/to-parents",
      to_staffs: "/administration/sms-management/to-staffs",
    },
    grade_management: {
      index: "/administration/grade-management",
      appreciations: "/administration/grade-management/appreciations",
    },
    index: "/administration",
    students: {
      index: "/administration/students",
      import: "/administration/students/import",
      excluded: "/administration/students/excluded",
    },
    transactions: "/administration/accounting/transactions",
    deleteTransactions: "/administration/accounting/transactions/deleted",
    photos: {
      index: "/administration/photos",
      content: "/administration/photos/content",
    },
    users: {
      index: "/administration/users",
      details: (id: string) => `/administration/users/${id}`,
      profile: (id: string) => `/administration/users/${id}/profile`,
      credentials: (id: string) => `/administration/users/${id}/credentials`,
    },
    classrooms: {
      levels: `/administration/classrooms/levels`,
      cycles: `/administration/classrooms/cycles`,
      sections: `/administration/classrooms/sections`,
    },
    fees: "/administration/fees",
  },
};
