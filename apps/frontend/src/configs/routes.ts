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
    index: "/assignments",
    details: (id: string) => `/assignments/${id}`,
  },
  staffs: {
    index: `/staffs`,
    payroll: (id: string) => `/staffs/${id}/payroll`,
    documents: (id: string) => `/staffs/${id}/documents`,
    timetables: (id: string) => `/staffs/${id}/timetables`,
    details: (id: string) => `/staffs/${id}`,
    teachings: (id: string) => `/staffs/${id}/teachings`,
  },
  reportcards: {
    index: "/reportcards",
    transcripts: "/reportcards/transcripts",
    appreciations: "/reportcards/appreciations",
    charts: "/reportcards/charts",
  },
  timetables: {
    index: "/timetables",
  },
  datum: {
    index: "",
  },
  auth: {
    login: `/auth/login`,
    signup: `/auth/signup`,
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
    index: "/subjects",
    details: (id: string) => `/subjects/${id}`,
  },

  programs: {
    index: "/programs",
    summary: "/programs/summary",
    homeworks: "/programs/homeworks",
    create: "/programs/create",
    monitoring: "/programs/monitoring",
  },
  contacts: {
    index: "/contacts",
    details: (id: string) => `/contacts/${id}`,
    edit: (id: string) => `/contacts/${id}/?edit=true`,
  },
  email: {
    index: "/email",
  },
  students: {
    index: "/students",
    health: {
      index: (id: string) => `/students/${id}/health`,
      immunizations: (id: string) => `/students/${id}/health/immunizations`,
      health_issues: (id: string) => `/students/${id}/health/health_issues`,
      drugs: (id: string) => `/students/${id}/health/drugs`,
      documents: (id: string) => `/students/${id}/health/documents`,
    },

    attendances: {
      index: (id: string) => `/students/${id}/attendances`,
      periodic: (id: string) => `/students/${id}/attendances/periodic`,
      justifications: (id: string) =>
        `/students/${id}/attendances/justifications`,
      summary: (id: string) => `/students/${id}/attendances/summary`,
    },
    info: {
      index: (id: string) => `/students/${id}`,
      contacts: (id: string) => `/students/${id}/contacts`,
    },

    notifications: (id: string) => `/students/${id}/notifications`,
    contacts: (id: string) => `/students/${id}/contacts`,
    print: (id: string) => `/students/${id}/print`,
    transactions: {
      create: (id: string) => `/students/${id}/transactions/create`,
      index: (id: string) => `/students/${id}/transactions`,
      account: (id: string) => `/students/${id}/transactions/account`,
      managePlan: (id: string) => `/students/${id}/account/manage-plan`,
      details: (studentId: string, transactionId: number) =>
        "/students/" + studentId + "/transactions/" + transactionId,
    },
    details: (id: string) => `/students/${id}`,
    edit: (id: string) => `/students/${id}/edit`,
    create: `/students/create`,
    gradesheets: (id: string) => `/students/${id}/gradesheets`,
    grades: (id: string) => `/students/${id}/grades`,
    studentReportCard: (id: string) => `/students/${id}/student-report`,
    classroomReportCard: (id: string) => `/students/${id}/classroom-report`,
    studentGraph: (id: string) => `/students/${id}/student-graph`,
    classroomGraph: (id: string) => `/students/${id}/classroom-graph`,
  },
  classrooms: {
    index: "/classrooms",
    fees: (id: string) => `/classrooms/${id}/fees`,
    timetables: (id: string) => `/classrooms/${id}/timetables`,
    assignments: {
      index: (id: string) => `/classrooms/${id}/assignments`,

      edit: (id: string, assignmentId: string) =>
        `/classrooms/${id}/assignments/${assignmentId}/edit`,
      details: (id: string, assignmentId: string) =>
        `/classrooms/${id}/assignments/${assignmentId}`,
    },
    finances: (id: string) => `/classrooms/${id}/finances`,
    details: (id: string) => `/classrooms/${id}`,
    edit: (id: string) => `/classrooms/${id}/?edit=true`,
    subjects: (id: string) => `/classrooms/${id}/subjects`,
    attendances: {
      index: (id: string) => `/classrooms/${id}/attendances`,
      periodic: (id: string) => `/classrooms/${id}/attendances/periodic`,
      absences: (id: string) => `/classrooms/${id}/attendances/absences`,
      chatters: (id: string) => `/classrooms/${id}/attendances/chatters`,
      consignes: (id: string) => `/classrooms/${id}/attendances/consignes`,
      exclusions: (id: string) => `/classrooms/${id}/attendances/exclusions`,
      lateness: (id: string) => `/classrooms/${id}/attendances/lateness`,
      weekly: (id: string) => `/classrooms/${id}/attendances/weekly`,
      hourly: (id: string) => `/classrooms/${id}/attendances/hourly`,
      digital: (id: string) => `/classrooms/${id}/attendances/digital`,
    },
    programs: (id: string) => `/classrooms/${id}/programs`,
    gradesheets: {
      index: (id: string) => `/classrooms/${id}/gradesheets`,
      details: (id: string, gradeId: number) =>
        `/classrooms/${id}/gradesheets/${gradeId}`,
      edit: (id: string, gradeId: number) =>
        `/classrooms/${id}/gradesheets/${gradeId}/?edit=true`,
      create: (id: string) => `/classrooms/${id}/gradesheets/create`,
    },
  },
  administration: {
    schools: {
      index: "/administration/schools",
      details: (id: string) => `/admin/schools/${id}`,
    },
    directory: {
      index: "/administration/directory",
    },
    courses: {
      index: "/administration/courses",
    },
    my_school: {
      index: `/administration/my-school`,
      details: (id: string) => `/admin/my-school/${id}`,
    },
    subjects: {
      index: "/administration/subjects",
      details: (id: string) => `/
      /subjects/${id}`,
    },
    sms_management: {
      details: (id: number) => `/administration/sms-emails/${id}`,
      history: "/administration/sms-emails",
      templates: "/administration/sms-emails/templates",
      to_parents: "/administration/sms-emails/to-parents",
      to_staffs: "/administration/sms-emails/to-staffs",
    },
    grade_management: {
      index: "/administration/grade-options",
      appreciations: "/administration/grade-options/appreciations",
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
      index: "/administration/classrooms",
      levels: `/administration/classrooms/levels`,
      cycles: `/administration/classrooms/cycles`,
      sections: `/administration/classrooms/sections`,
    },
    fees: "/administration/fees",
  },
};
