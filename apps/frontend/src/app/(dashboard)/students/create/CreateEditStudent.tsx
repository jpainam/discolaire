"use client";

import { useState } from "react";
import type { z } from "zod/v4";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "~/components/stepper";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { AcademicInfoStep } from "./AcademicInfoStep";
import { BasicInfoStep } from "./BasicInfoStep";
import { ParentsStep } from "./ParentsStep";
import { ReviewSubmitStep } from "./ReviewSubmitStep";
import { useStudentFormContext } from "./StudentFormContext";
import { studentSchema } from "./validation";

const stepFormIdMap: Record<number, string> = {
  1: "student-basic-info-form",
  2: "student-academic-info-form",
  3: "student-parents-form",
};

const toRelationshipId = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const toStudentMutationInput = (data: z.output<typeof studentSchema>) => {
  return {
    registrationNumber: data.registrationNumber,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    placeOfBirth: data.placeOfBirth,
    gender: data.gender,
    residence: data.residence,
    externalAccountingNo: data.externalAccountingNo,
    phoneNumber: data.phoneNumber,
    formerSchoolId: data.formerSchoolId,
    allergies: data.allergies,
    isRepeating: data.isRepeating,
    isNew: data.isNew,
    countryId: data.countryId,
    isBaptized: data.isBaptized,
    religionId: data.religionId,
    dateOfEntry: data.dateOfEntry,
    bloodType: data.bloodType,
    dateOfExit: data.dateOfExit,
    tags: data.tags,
    observation: data.observation,
    clubs: data.clubs,
    sports: data.sports,
    status: data.status,
    classroom: data.classroomId?.trim() ? data.classroomId : undefined,
  };
};

type StudentDetails = RouterOutputs["student"]["get"];

export function CreateEditStudent({ student }: { student?: StudentDetails }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(student);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSyncingContacts, setIsSyncingContacts] = useState(false);

  const {
    currentStep,
    setCurrentStep,
    basicInfo,
    academicInfo,
    selectedParents,
  } = useStudentFormContext();

  const steps = [
    {
      id: 1,
      title: t("Basic Information"),
      description: "Information basic about the student",
      icon: User,
    },
    {
      id: 2,
      title: t("Academic Details"),
      description: "Information about the academic details",
      icon: Building,
    },
    {
      id: 3,
      title: t("Parents Guardians"),
      description: "Les parents, contacts et tuteurs",
      icon: Users,
    },
    {
      id: 4,
      title: "Review Submit",
      description: "Revoir les details avant soumission",
      icon: Check,
    },
  ];

  const createStudentContact = useMutation(
    trpc.studentContact.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateStudentContact = useMutation(
    trpc.studentContact.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const deleteStudentContact = useMutation(
    trpc.studentContact.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const uploadAvatar = async (ownerId: string) => {
    if (!avatarFile) {
      return;
    }
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", avatarFile, avatarFile.name);
      const response = await fetch(
        `/api/upload/avatars?id=${ownerId}&profile=student`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      setAvatarFile(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Avatar upload failed",
        { id: 0 },
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const syncStudentContacts = async (studentId: string) => {
    setIsSyncingContacts(true);
    try {
      const existingLinks = student?.studentContacts ?? [];
      const existingByContactId = new Map(
        existingLinks.map((link) => [link.contactId, link]),
      );
      const selectedByContactId = new Map(
        selectedParents.map((parent) => [parent.id, parent]),
      );

      const contactsToCreate = selectedParents
        .filter((parent) => !existingByContactId.has(parent.id))
        .map((parent) => ({
          studentId,
          contactId: parent.id,
          relationshipId: toRelationshipId(parent.relationshipId),
        }));

      const contactsToUpdate = selectedParents
        .filter((parent) => {
          const existingLink = existingByContactId.get(parent.id);
          if (!existingLink) {
            return false;
          }
          const currentRelationship = existingLink.relationshipId?.toString() ?? "";
          return currentRelationship !== parent.relationshipId;
        })
        .map((parent) => {
          const existingLink = existingByContactId.get(parent.id);
          if (!existingLink) {
            return null;
          }
          return {
            studentId,
            contactId: parent.id,
            relationshipId: toRelationshipId(parent.relationshipId),
            livesWith: existingLink.livesWith ?? true,
            schoolPickup: existingLink.schoolPickup ?? true,
            emergencyContact: existingLink.emergencyContact ?? true,
            observation: existingLink.observation ?? undefined,
            accessAttendance: existingLink.accessAttendance ?? true,
            accessBilling: existingLink.accessBilling ?? true,
            accessReportCard: existingLink.accessReportCard ?? true,
            accessScheduling: existingLink.accessScheduling ?? true,
            canAccessData: existingLink.canAccessData ?? true,
            enablePortalAccess: existingLink.enablePortalAccess ?? true,
            primaryContact: existingLink.primaryContact ?? true,
            paysFee: existingLink.paysFee ?? true,
          };
        })
        .filter((item) => item !== null);

      const contactsToDelete = existingLinks.filter(
        (link) => !selectedByContactId.has(link.contactId),
      );

      if (contactsToCreate.length > 0) {
        await createStudentContact.mutateAsync(contactsToCreate);
      }
      if (contactsToUpdate.length > 0) {
        await updateStudentContact.mutateAsync(contactsToUpdate);
      }
      if (contactsToDelete.length > 0) {
        await Promise.all(
          contactsToDelete.map((link) =>
            deleteStudentContact.mutateAsync({
              studentId,
              contactId: link.contactId,
            }),
          ),
        );
      }
    } finally {
      setIsSyncingContacts(false);
    }
  };

  const finishSubmission = async (studentId: string) => {
    let contactsSyncFailed = false;
    try {
      await syncStudentContacts(studentId);
    } catch {
      contactsSyncFailed = true;
    }
    await uploadAvatar(studentId);
    await Promise.all([
      queryClient.invalidateQueries(trpc.student.pathFilter()),
      queryClient.invalidateQueries(trpc.student.contacts.pathFilter()),
    ]);
    if (contactsSyncFailed) {
      toast.warning("Student saved, but parent links were not fully synced.", {
        id: 0,
      });
    } else {
      toast.success(
        isEditMode ? t("updated_successfully") : t("created_successfully"),
        { id: 0 },
      );
    }
    router.push(`/students/${studentId}`);
  };

  const createStudentMutation = useMutation(
    trpc.student.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async (created) => {
        await finishSubmission(created.id);
      },
    }),
  );
  const updateStudentMutation = useMutation(
    trpc.student.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async (updated) => {
        await finishSubmission(updated.id);
      },
    }),
  );

  const isSubmitting =
    createStudentMutation.isPending ||
    updateStudentMutation.isPending ||
    isUploadingAvatar ||
    isSyncingContacts;

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    const parsed = studentSchema.safeParse({
      ...basicInfo,
      ...academicInfo,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid student form", {
        id: 0,
      });
      return;
    }
    toast.loading(t("Processing"), { id: 0 });
    const payload = toStudentMutationInput(parsed.data);
    if (student) {
      updateStudentMutation.mutate({
        ...payload,
        id: student.id,
      });
      return;
    }
    createStudentMutation.mutate(payload);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <BasicInfoStep
            onNextAction={nextStep}
            initialAvatar={student?.avatar ?? null}
            onAvatarFileChange={setAvatarFile}
          />
        );
      case 2:
        return <AcademicInfoStep onNextAction={nextStep} />;
      case 3:
        return <ParentsStep />;
      case 4:
        return <ReviewSubmitStep />;
      default:
        return "Unknown step";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted/50 flex flex-row items-center gap-2 border-b px-4 py-1">
        <Label>{isEditMode ? t("edit") : t("add")}</Label>
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            variant="secondary"
            type="button"
          >
            <ArrowLeft />
            {t("previous")}
          </Button>
          {currentStep < steps.length ? (
            currentStep === 3 ? (
              <Button
                variant="default"
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
              >
                {t("next")}
                <ArrowRight />
              </Button>
            ) : (
              <Button
                variant="default"
                type="submit"
                disabled={isSubmitting}
                form={stepFormIdMap[currentStep]}
              >
                {isSubmitting && <Spinner />}
                {t("next")}
                <ArrowRight />
              </Button>
            )
          ) : (
            <Button
              type="button"
              variant="default"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {t("submit")}
            </Button>
          )}
        </div>
      </div>

      <Stepper
        defaultValue={1}
        value={currentStep}
        onValueChange={(step) => {
          if (step <= currentStep && !isSubmitting) {
            setCurrentStep(step);
          }
        }}
      >
        {steps.map(({ id, title }) => (
          <StepperItem key={id} step={id} className="relative flex-1 flex-col!">
            <StepperTrigger type="button" className="flex-col gap-3 rounded">
              <StepperIndicator />
              <div className="space-y-0.5 px-2">
                <StepperTitle>{title}</StepperTitle>
                <StepperDescription className="max-sm:hidden" />
              </div>
            </StepperTrigger>
            {id < steps.length && (
              <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
            )}
          </StepperItem>
        ))}
      </Stepper>
      <div className="flex-1 px-4">{getStepContent(currentStep)}</div>
    </div>
  );
}
