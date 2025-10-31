import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { StudentData } from "./validation";

interface StudentStore {
  currentStep: number;
  studentData: Partial<StudentData>;
  selectedParents: { id: string; name: string }[];
  completedSteps: Set<number>;

  // Actions
  setCurrentStep: (step: number) => void;
  updateStudentData: (data: Partial<StudentData>) => void;
  addParent: (data: { parentId: string; name: string }) => void;
  removeParent: (parentId: string) => void;
  //updateParent: (parentId: string, updates: Partial<string>) => void;
  markStepComplete: (step: number) => void;
  resetForm: () => void;

  // Getters
  isStepComplete: (step: number) => boolean;
  canProceedToStep: (step: number) => boolean;
  step1IsValid: boolean;
  setStep1IsValid: (isValid: boolean) => void;
  step2IsValid: boolean;
  setStep2IsValid: (isValid: boolean) => void;
  step3IsValid: boolean;
  setStep3IsValid: (isValid: boolean) => void;
}

const initialStudentData: Partial<StudentData> = {
  countryId: "CM",
  dateOfEntry: new Date(),
  dateOfExit: undefined,
  isRepeating: false,
  formerSchoolId: "",
  allergies: "",
  status: "ACTIVE",
  isNew: true,
  externalAccountingNo: "",
};

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      step1IsValid: false,
      setStep1IsValid: (isValid) => set({ step1IsValid: isValid }),
      step2IsValid: false,
      setStep2IsValid: (isValid) => set({ step1IsValid: isValid }),
      step3IsValid: true,
      setStep3IsValid: (isValid) => set({ step1IsValid: isValid }),
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
            { id: parent.parentId, name: parent.name },
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
