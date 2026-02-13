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

const toDate = (value: unknown, fallback: Date) => {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const nextDate = new Date(value);
    if (!Number.isNaN(nextDate.getTime())) {
      return nextDate;
    }
  }
  return fallback;
};

const toOptionalDate = (value: unknown) => {
  if (!value) {
    return undefined;
  }
  const nextDate = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(nextDate.getTime())) {
    return undefined;
  }
  return nextDate;
};

export function StudentFormProvider({
  children,
  initialStep = 1,
  initialBasicValues,
  initialAcademicValues,
  initialSelectedParents,
}: {
  children: React.ReactNode;
  initialStep?: number;
  initialBasicValues?: Partial<BasicInfo>;
  initialAcademicValues?: Partial<AcademicInfo>;
  initialSelectedParents?: ParentInfo[];
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    ...initialBasicInfo,
    ...initialBasicValues,
    dateOfBirth: toDate(
      initialBasicValues?.dateOfBirth,
      initialBasicInfo.dateOfBirth,
    ),
    clubs: initialBasicValues?.clubs ?? initialBasicInfo.clubs,
    sports: initialBasicValues?.sports ?? initialBasicInfo.sports,
    tags: initialBasicValues?.tags ?? initialBasicInfo.tags,
    isBaptized: initialBasicValues?.isBaptized ?? initialBasicInfo.isBaptized,
  });
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    ...initialAcademicInfo,
    ...initialAcademicValues,
    dateOfEntry: toDate(
      initialAcademicValues?.dateOfEntry,
      initialAcademicInfo.dateOfEntry,
    ),
    dateOfExit: toOptionalDate(initialAcademicValues?.dateOfExit),
    isRepeating:
      initialAcademicValues?.isRepeating ?? initialAcademicInfo.isRepeating,
    isNew: initialAcademicValues?.isNew ?? initialAcademicInfo.isNew,
  });
  const [selectedParents, setSelectedParents] = useState<ParentInfo[]>(
    initialSelectedParents ?? [],
  );

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
