import { create } from "zustand";
import { persist } from "zustand/middleware";

import { StudentStatus } from "@repo/db";

import type { StudentData } from "./validation";

interface StudentStore {
  currentStep: number;
  studentData: Partial<StudentData>;
  selectedParents: { id: string; name: string }[];
  completedSteps: Set<number>;

  // Actions
  setCurrentStep: (step: number) => void;
  updateStudentData: (data: Partial<StudentData>) => void;
  addParent: (data: {
    parentId: string;
    name: string;
    relationshipId: string;
  }) => void;
  removeParent: (parentId: string) => void;
  //updateParent: (parentId: string, updates: Partial<string>) => void;
  markStepComplete: (step: number) => void;
  resetForm: () => void;

  // Getters
  isStepComplete: (step: number) => boolean;
  canProceedToStep: (step: number) => boolean;
}

export const initialStudentData: Partial<StudentData> = {
  registrationNumber: "",
  tags: [],
  firstName: "",
  bloodType: "",
  lastName: "",
  dateOfBirth: undefined,
  placeOfBirth: "",
  gender: "male",
  residence: "",
  phoneNumber: "",
  isRepeating: false,
  isNew: true,
  countryId: "",
  classroomId: "",
  allergies: "",
  externalAccountingNo: "",
  dateOfExit: undefined,
  dateOfEntry: new Date(),
  formerSchoolId: "",
  observation: "",
  religionId: "",
  isBaptized: false,
  status: StudentStatus.ACTIVE,
  clubs: [],
  sports: [],
};

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      studentData: initialStudentData,
      selectedParents: [],
      completedSteps: new Set(),
      setCurrentStep: (step) => set({ currentStep: step }),

      updateStudentData: (data) =>
        set((state) => ({
          studentData: { ...state.studentData, ...data },
        })),

      addParent: (parent) =>
        set((state) => ({
          selectedParents: [
            ...state.selectedParents,
            {
              id: parent.parentId,
              name: parent.name,
              relationshipId: parent.relationshipId,
            },
          ],
        })),

      removeParent: (parentId) =>
        set((state) => ({
          selectedParents: state.selectedParents.filter(
            (p) => p.id !== parentId,
          ),
        })),

      // updateParent: (parentId, updates) =>
      //   set((state) => ({
      //     selectedParents: state.selectedParents.map((p) =>
      //       p === parentId ? { p, updates } : [p],
      //     ),
      //   })),

      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: new Set([...state.completedSteps, step]),
        })),

      resetForm: () =>
        set({
          currentStep: 1,
          studentData: initialStudentData,
          selectedParents: [],
          completedSteps: new Set(),
        }),

      isStepComplete: (step) => get().completedSteps.has(step),

      canProceedToStep: (step) => {
        const { completedSteps } = get();
        return step === 1 || completedSteps.has(step - 1);
      },
    }),
    {
      name: "student-form-storage",
      partialize: (state) => ({
        studentData: state.studentData,
        selectedParents: state.selectedParents,
        currentStep: state.currentStep,
      }),
    },
  ),
);
