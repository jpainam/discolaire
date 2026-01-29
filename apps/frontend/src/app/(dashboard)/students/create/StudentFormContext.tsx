"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { AcademicInfo, BasicInfo, ParentInfo } from "./validation";
import { initialStudentData } from "./store";

interface StudentFormContextValue {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  basicInfo: BasicInfo;
  setBasicInfo: (data: BasicInfo) => void;
  academicInfo: AcademicInfo;
  setAcademicInfo: (data: AcademicInfo) => void;
  selectedParents: ParentInfo[];
  setSelectedParents: (parents: ParentInfo[]) => void;
  addParent: (parent: ParentInfo) => void;
  removeParent: (parentId: string) => void;
}

const StudentFormContext = createContext<StudentFormContextValue | null>(null);

const initialBasicInfo: BasicInfo = {
  firstName: initialStudentData.firstName ?? "",
  lastName: initialStudentData.lastName ?? "",
  dateOfBirth: initialStudentData.dateOfBirth ?? new Date(),
  placeOfBirth: initialStudentData.placeOfBirth ?? "",
  gender: initialStudentData.gender ?? "male",
  countryId: initialStudentData.countryId ?? "",
  bloodType: initialStudentData.bloodType ?? "",
  religionId: initialStudentData.religionId ?? "",
  clubs: initialStudentData.clubs ?? [],
  sports: initialStudentData.sports ?? [],
  isBaptized: initialStudentData.isBaptized ?? false,
  tags: initialStudentData.tags ?? [],
  registrationNumber: initialStudentData.registrationNumber ?? "",
  externalAccountingNo: initialStudentData.externalAccountingNo ?? "",
  phoneNumber: initialStudentData.phoneNumber ?? "",
  residence: initialStudentData.residence ?? "",
  allergies: initialStudentData.allergies ?? "",
  observation: initialStudentData.observation ?? "",
};

const initialAcademicInfo: AcademicInfo = {
  classroomId: initialStudentData.classroomId ?? "",
  dateOfEntry: initialStudentData.dateOfEntry ?? new Date(),
  dateOfExit: initialStudentData.dateOfExit,
  isRepeating: initialStudentData.isRepeating ?? false,
  isNew: initialStudentData.isNew ?? true,
  status: initialStudentData.status ?? "ACTIVE",
  formerSchoolId: initialStudentData.formerSchoolId ?? "",
};

export function StudentFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(initialBasicInfo);
  const [academicInfo, setAcademicInfo] =
    useState<AcademicInfo>(initialAcademicInfo);
  const [selectedParents, setSelectedParents] = useState<ParentInfo[]>([]);

  const addParent = useCallback((parent: ParentInfo) => {
    setSelectedParents((prev) => {
      if (prev.some((item) => item.id === parent.id)) {
        return prev;
      }
      return [...prev, parent];
    });
  }, []);

  const removeParent = useCallback((parentId: string) => {
    setSelectedParents((prev) =>
      prev.filter((parent) => parent.id !== parentId),
    );
  }, []);

  const value = useMemo(
    () => ({
      currentStep,
      setCurrentStep,
      basicInfo,
      setBasicInfo,
      academicInfo,
      setAcademicInfo,
      selectedParents,
      setSelectedParents,
      addParent,
      removeParent,
    }),
    [
      academicInfo,
      basicInfo,
      currentStep,
      selectedParents,
      addParent,
      removeParent,
    ],
  );

  return (
    <StudentFormContext.Provider value={value}>
      {children}
    </StudentFormContext.Provider>
  );
}

export function useStudentFormContext() {
  const context = useContext(StudentFormContext);
  if (!context) {
    throw new Error(
      "useStudentFormContext must be used within StudentFormProvider",
    );
  }
  return context;
}
