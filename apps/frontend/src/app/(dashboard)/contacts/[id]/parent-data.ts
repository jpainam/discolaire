export interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  relationship: string;
  photo: string;
  isPrimaryContact: boolean;
  canPickup: boolean;
  isEmergencyContact: boolean;
}

export interface NotificationPreference {
  channel: "email" | "sms" | "push" | "whatsapp";
  enabled: boolean;
  types: string[];
}

export interface CommunicationLog {
  id: string;
  date: string;
  type: "email" | "sms" | "call" | "meeting" | "app";
  subject: string;
  status: "sent" | "delivered" | "read" | "replied";
  direction: "inbound" | "outbound";
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  status: "pending" | "approved" | "expired";
}

export interface Event {
  id: string;
  name: string;
  date: string;
  attended: boolean;
  type: "meeting" | "event" | "conference" | "workshop";
}

export interface ParentContact {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  profession: string;
  employer: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  language: string;
  primaryEmail: string;
  secondaryEmail: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  homeAddress: string;
  workAddress: string;
  preferredContactMethod: string;
  preferredContactTime: string;
  status: "active" | "inactive" | "blocked";
  portalAccess: boolean;
  lastLogin: string;
  accountCreated: string;
  students: Student[];
  notificationPreferences: NotificationPreference[];
  communicationLog: CommunicationLog[];
  documents: Document[];
  events: Event[];
  financialContact: boolean;
  outstandingBalance: number;
  engagementScore: number;
  notes: string;
}

export const parentData: ParentContact = {
  id: "PC-2024-0847",
  firstName: "Jacques Landry",
  lastName: "Biouele",
  photo: "",
  profession: "Software Engineer",
  employer: "TechCorp International",
  nationalId: "CM-19850423-M-00847",
  dateOfBirth: "1985-04-23",
  gender: "Male",
  language: "French",
  primaryEmail: "j.biouele@techcorp.cm",
  secondaryEmail: "jacquesbiouele@gmail.com",
  phone1: "+237 699 216 257",
  phone2: "+237 657 459 595",
  whatsapp: "+237 699 216 257",
  homeAddress: "Quartier Bastos, Rue 1.234, Yaoundé, Cameroon",
  workAddress: "Immeuble TechHub, Avenue Kennedy, Yaoundé",
  preferredContactMethod: "WhatsApp",
  preferredContactTime: "Evening (18:00 - 20:00)",
  status: "active",
  portalAccess: true,
  lastLogin: "2026-01-28T14:32:00",
  accountCreated: "2022-09-01",
  students: [
    {
      id: "STU-2024-1234",
      name: "Marie-Claire Biouele",
      grade: "Grade 8",
      class: "8A",
      relationship: "Father",
      photo: "",
      isPrimaryContact: true,
      canPickup: true,
      isEmergencyContact: true,
    },
    {
      id: "STU-2024-1235",
      name: "Jean-Pierre Biouele",
      grade: "Grade 5",
      class: "5B",
      relationship: "Father",
      photo: "",
      isPrimaryContact: true,
      canPickup: true,
      isEmergencyContact: true,
    },
    {
      id: "STU-2024-1890",
      name: "Amina Fotso",
      grade: "Grade 10",
      class: "10A",
      relationship: "Uncle",
      photo: "",
      isPrimaryContact: false,
      canPickup: true,
      isEmergencyContact: true,
    },
  ],
  notificationPreferences: [
    {
      channel: "email",
      enabled: true,
      types: ["Grades", "Attendance", "Events", "Emergencies", "Newsletters"],
    },
    {
      channel: "sms",
      enabled: true,
      types: ["Emergencies", "Attendance", "Urgent Notices"],
    },
    {
      channel: "whatsapp",
      enabled: true,
      types: ["Daily Updates", "Homework", "Events"],
    },
    {
      channel: "push",
      enabled: false,
      types: [],
    },
  ],
  communicationLog: [
    {
      id: "COM-001",
      date: "2026-01-28T10:15:00",
      type: "email",
      subject: "Term 2 Report Card Available",
      status: "read",
      direction: "outbound",
    },
    {
      id: "COM-002",
      date: "2026-01-25T08:30:00",
      type: "sms",
      subject: "Marie-Claire absent from morning class",
      status: "delivered",
      direction: "outbound",
    },
    {
      id: "COM-003",
      date: "2026-01-22T16:45:00",
      type: "call",
      subject: "Parent-Teacher Meeting Follow-up",
      status: "replied",
      direction: "inbound",
    },
    {
      id: "COM-004",
      date: "2026-01-20T09:00:00",
      type: "meeting",
      subject: "Academic Progress Discussion",
      status: "read",
      direction: "inbound",
    },
    {
      id: "COM-005",
      date: "2026-01-15T14:20:00",
      type: "app",
      subject: "Fee Payment Reminder",
      status: "read",
      direction: "outbound",
    },
  ],
  documents: [
    {
      id: "DOC-001",
      name: "Photo ID / Passport",
      type: "identification",
      uploadedDate: "2022-09-01",
      status: "approved",
    },
    {
      id: "DOC-002",
      name: "Proof of Address",
      type: "address",
      uploadedDate: "2024-08-15",
      status: "approved",
    },
    {
      id: "DOC-003",
      name: "Authorization Letter - Pickup",
      type: "authorization",
      uploadedDate: "2025-09-01",
      status: "approved",
    },
    {
      id: "DOC-004",
      name: "Medical Emergency Consent",
      type: "medical",
      uploadedDate: "2023-01-10",
      status: "expired",
    },
  ],
  events: [
    {
      id: "EVT-001",
      name: "Parent-Teacher Conference",
      date: "2026-01-20",
      attended: true,
      type: "conference",
    },
    {
      id: "EVT-002",
      name: "Annual Sports Day",
      date: "2025-12-15",
      attended: true,
      type: "event",
    },
    {
      id: "EVT-003",
      name: "Academic Workshop",
      date: "2025-11-28",
      attended: false,
      type: "workshop",
    },
    {
      id: "EVT-004",
      name: "End of Year Celebration",
      date: "2025-07-15",
      attended: true,
      type: "event",
    },
    {
      id: "EVT-005",
      name: "Orientation Meeting",
      date: "2024-09-05",
      attended: true,
      type: "meeting",
    },
  ],
  financialContact: true,
  outstandingBalance: 125000,
  engagementScore: 87,
  notes:
    "Very involved parent. Prefers communication in French. Has volunteered for school events multiple times. Key contact for the PTA.",
};
