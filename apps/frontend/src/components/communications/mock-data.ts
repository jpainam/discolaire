export type RecipientType =
  | "teachers"
  | "parents"
  | "students"
  | "staff"
  | "all";

export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  teachers: Person[];
  studentCount: number;
  parentCount: number;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "parent" | "student" | "staff";
  classId?: string;
  avatar?: string;
}

export interface Message {
  id: string;
  subject: string;
  preview: string;
  from: string;
  to: string;
  date: string;
  read: boolean;
  folder: "inbox" | "sent" | "drafts" | "trash";
  recipientCount?: number;
  body?: string;
}

export const CLASSES: ClassRoom[] = [
  {
    id: "c1",
    name: "Class 6A",
    grade: "Grade 6",
    studentCount: 28,
    parentCount: 26,
    teachers: [
      {
        id: "t1",
        name: "Mrs. Sarah Thompson",
        email: "s.thompson@school.edu",
        role: "teacher",
        classId: "c1",
      },
      {
        id: "t2",
        name: "Mr. James Lee",
        email: "j.lee@school.edu",
        role: "teacher",
        classId: "c1",
      },
    ],
  },
  {
    id: "c2",
    name: "Class 6B",
    grade: "Grade 6",
    studentCount: 30,
    parentCount: 29,
    teachers: [
      {
        id: "t3",
        name: "Ms. Emily Carter",
        email: "e.carter@school.edu",
        role: "teacher",
        classId: "c2",
      },
      {
        id: "t4",
        name: "Mr. David Nkosi",
        email: "d.nkosi@school.edu",
        role: "teacher",
        classId: "c2",
      },
    ],
  },
  {
    id: "c3",
    name: "Class 7A",
    grade: "Grade 7",
    studentCount: 27,
    parentCount: 25,
    teachers: [
      {
        id: "t5",
        name: "Mrs. Linda Okafor",
        email: "l.okafor@school.edu",
        role: "teacher",
        classId: "c3",
      },
      {
        id: "t6",
        name: "Mr. Paul Fernandez",
        email: "p.fernandez@school.edu",
        role: "teacher",
        classId: "c3",
      },
    ],
  },
  {
    id: "c4",
    name: "Class 7B",
    grade: "Grade 7",
    studentCount: 29,
    parentCount: 28,
    teachers: [
      {
        id: "t7",
        name: "Mr. Ahmed Hassan",
        email: "a.hassan@school.edu",
        role: "teacher",
        classId: "c4",
      },
      {
        id: "t8",
        name: "Ms. Rachel Kim",
        email: "r.kim@school.edu",
        role: "teacher",
        classId: "c4",
      },
    ],
  },
  {
    id: "c5",
    name: "Class 8A",
    grade: "Grade 8",
    studentCount: 31,
    parentCount: 30,
    teachers: [
      {
        id: "t9",
        name: "Mrs. Grace Mensah",
        email: "g.mensah@school.edu",
        role: "teacher",
        classId: "c5",
      },
      {
        id: "t10",
        name: "Mr. Tom Wilson",
        email: "t.wilson@school.edu",
        role: "teacher",
        classId: "c5",
      },
    ],
  },
  {
    id: "c6",
    name: "Class 8B",
    grade: "Grade 8",
    studentCount: 26,
    parentCount: 24,
    teachers: [
      {
        id: "t11",
        name: "Ms. Priya Sharma",
        email: "p.sharma@school.edu",
        role: "teacher",
        classId: "c6",
      },
      {
        id: "t12",
        name: "Mr. Lucas Dubois",
        email: "l.dubois@school.edu",
        role: "teacher",
        classId: "c6",
      },
    ],
  },
];

export const ALL_STAFF: Person[] = [
  {
    id: "s1",
    name: "Principal Marcus Webb",
    email: "m.webb@school.edu",
    role: "staff",
  },
  {
    id: "s2",
    name: "Vice Principal Diane Park",
    email: "d.park@school.edu",
    role: "staff",
  },
  {
    id: "s3",
    name: "School Counselor Amy Rice",
    email: "a.rice@school.edu",
    role: "staff",
  },
  {
    id: "s4",
    name: "Admin Officer Ben Clarke",
    email: "b.clarke@school.edu",
    role: "staff",
  },
  ...CLASSES.flatMap((c) => c.teachers),
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    subject: "Term 2 School Fees Reminder",
    preview:
      "Dear Parents, this is a reminder that Term 2 school fees are due by the end of this month...",
    from: "Admin",
    to: "All Parents",
    date: "2026-02-24",
    read: false,
    folder: "sent",
    recipientCount: 162,
    body: "Dear Parents,\n\nThis is a friendly reminder that Term 2 school fees are due by the end of this month — February 28, 2026.\n\nPlease ensure payment is made via the school portal or at the finance office.\n\nThank you for your cooperation.\n\nKind regards,\nSchool Administration",
  },
  {
    id: "m2",
    subject: "Parent-Teacher Meeting — Grade 7",
    preview:
      "We would like to invite all Grade 7 parents to our upcoming parent-teacher meeting...",
    from: "Admin",
    to: "Grade 7 Parents",
    date: "2026-02-20",
    read: true,
    folder: "sent",
    recipientCount: 53,
    body: "Dear Grade 7 Parents,\n\nWe would like to invite all Grade 7 parents to our upcoming parent-teacher meeting scheduled for March 5, 2026 at 2:00 PM in the school hall.\n\nPlease confirm your attendance by replying to this email.\n\nWarm regards,\nSchool Administration",
  },
  {
    id: "m3",
    subject: "[DRAFT] Sports Day Announcement",
    preview:
      "We are pleased to announce that our annual Sports Day will be held on...",
    from: "Admin",
    to: "All Students & Parents",
    date: "2026-02-25",
    read: true,
    folder: "drafts",
    recipientCount: 0,
    body: "Dear Students and Parents,\n\nWe are pleased to announce that our annual Sports Day will be held on March 15, 2026.\n\nAll students are encouraged to participate. More details to follow.",
  },
  {
    id: "m4",
    subject: "Staff Meeting — February 27",
    preview:
      "All teaching and non-teaching staff are required to attend the monthly staff meeting...",
    from: "Admin",
    to: "All Staff",
    date: "2026-02-22",
    read: true,
    folder: "sent",
    recipientCount: 16,
    body: "Dear Staff,\n\nAll teaching and non-teaching staff are required to attend the monthly staff meeting on February 27, 2026 at 7:30 AM in the conference room.\n\nAgenda will be circulated by tomorrow morning.\n\nBest regards,\nPrincipal Marcus Webb",
  },
  {
    id: "m5",
    subject: "Re: Curriculum Update Request",
    preview:
      "Thank you for your message. We have reviewed your request and will be implementing...",
    from: "Mrs. Linda Okafor",
    to: "Admin",
    date: "2026-02-19",
    read: false,
    folder: "inbox",
    body: "Dear Admin,\n\nThank you for your message. We have reviewed the curriculum update request and will be implementing the changes starting next term.\n\nKind regards,\nMrs. Linda Okafor",
  },
  {
    id: "m6",
    subject: "Absence Notification — Class 6A",
    preview:
      "I am writing to inform you that my daughter Emma will be absent from school on...",
    from: "Parent (Emma Thompson)",
    to: "Admin",
    date: "2026-02-18",
    read: true,
    folder: "inbox",
    body: "Dear Administration,\n\nI am writing to inform you that my daughter Emma Thompson (Class 6A) will be absent from school on February 26-27, 2026 due to a medical appointment.\n\nPlease let her teachers know.\n\nThank you,\nMrs. Thompson",
  },
];

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
