import type { Student } from "~/types/student";

// Mock data for a single student
const mockStudent: Student = {
  id: "1",
  firstName: "Emma",
  lastName: "Johnson",
  photoUrl:
    "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=256",
  dateOfBirth: "January 15, 2008",
  placeOfBirth: "Chicago, IL",
  isAdventist: true,
  isBaptized: true,
  address: "1234 Maple Street, Springfield, IL 62701",
  isNew: true,
  isRepeating: false,
  currentClass: "9th Grade",
  admissionDate: "August 20, 2024",
  parents: [
    {
      fullName: "Sarah Johnson",
      relationship: "Mother",
      photoUrl:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=256",
      phoneNumber: "(555) 123-4567",
      email: "sarah.johnson@example.com",
      address: "1234 Maple Street, Springfield, IL 62701",
      occupation: "Software Engineer",
      isEmergencyContact: true,
    },
    {
      fullName: "Michael Johnson",
      relationship: "Father",
      photoUrl:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=256",
      phoneNumber: "(555) 987-6543",
      email: "michael.johnson@example.com",
      address: "1234 Maple Street, Springfield, IL 62701",
      occupation: "Marketing Director",
      isEmergencyContact: false,
    },
  ],
  academicTerms: [
    {
      name: "Current",
      period: "Fall 2024",
      grades: [
        {
          subject: "Mathematics",
          score: 92,
          teacher: "Ms. Robinson",
        },
        {
          subject: "Science",
          score: 88,
          teacher: "Mr. Garcia",
        },
        {
          subject: "English",
          score: 95,
          teacher: "Mrs. Williams",
        },
        {
          subject: "History",
          score: 85,
          teacher: "Mr. Thompson",
        },
      ],
    },
    {
      name: "Previous",
      period: "Spring 2024",
      grades: [
        {
          subject: "Mathematics",
          score: 89,
          teacher: "Ms. Robinson",
        },
        {
          subject: "Science",
          score: 92,
          teacher: "Mr. Garcia",
        },
        {
          subject: "English",
          score: 90,
          teacher: "Mrs. Williams",
        },
        {
          subject: "History",
          score: 87,
          teacher: "Mr. Thompson",
        },
      ],
    },
  ],
  fees: [
    {
      id: "fee1",
      name: "Tuition Fee",
      period: "2024-2025",
      amount: 5000,
      amountPaid: 2500,
      dueDate: "October 15, 2024",
      payments: [
        {
          date: "August 25, 2024",
          amount: 2500,
          method: "Credit Card",
          reference: "TF24080025",
        },
      ],
    },
    {
      id: "fee2",
      name: "Library Fee",
      period: "2024-2025",
      amount: 300,
      amountPaid: 300,
      dueDate: "September 10, 2024",
      payments: [
        {
          date: "September 5, 2024",
          amount: 300,
          method: "Bank Transfer",
          reference: "LF24090005",
        },
      ],
    },
    {
      id: "fee3",
      name: "Technology Fee",
      period: "2024-2025",
      amount: 500,
      amountPaid: 0,
      dueDate: "November 30, 2024",
      payments: [],
    },
  ],
  transactions: [
    {
      title: "Tuition Payment",
      description: "First installment for 2024-2025",
      amount: 2500,
      date: "August 25, 2024",
      category: "Tuition",
      type: "credit",
    },
    {
      title: "Library Fee",
      description: "Annual library access fee",
      amount: 300,
      date: "September 5, 2024",
      category: "Fees",
      type: "credit",
    },
    {
      title: "Uniform Purchase",
      description: "School uniform set",
      amount: 150,
      date: "September 10, 2024",
      category: "Store",
      type: "debit",
    },
    {
      title: "Field Trip",
      description: "Science museum visit",
      amount: 45,
      date: "September 20, 2024",
      category: "Activities",
      type: "debit",
    },
  ],
  financialInfo: {
    currentBalance: 2605,
    lastTransactionDate: "September 20, 2024",
  },
};

// Function to simulate fetching student data
export function getStudent(id: string): Student | null {
  // In a real app, this would fetch from an API
  if (id === "1") {
    return mockStudent;
  }
  return null;
}

// Function to simulate fetching multiple students
export function getStudents(): Student[] {
  // In a real app, this would fetch from an API
  return [mockStudent];
}
