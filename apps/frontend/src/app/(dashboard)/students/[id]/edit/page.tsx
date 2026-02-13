import { NoPermission } from "~/components/no-permission";
import { checkPermission } from "~/permissions/server";
import { caller, HydrateClient } from "~/trpc/server";
import { getFullName } from "~/utils";
import { CreateEditStudent } from "../../create/CreateEditStudent";
import { StudentFormProvider } from "../../create/StudentFormContext";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const canEditStudent = await checkPermission("student.update");
  if (!canEditStudent) {
    return <NoPermission />;
  }

  const student = await caller.student.get(params.id);

  const initialBasicValues = {
    firstName: student.firstName ?? "",
    lastName: student.lastName ?? "",
    dateOfBirth: student.dateOfBirth ?? new Date(),
    placeOfBirth: student.placeOfBirth ?? "",
    gender: (student.gender ?? "male") as "male" | "female",
    countryId: student.countryId ?? "",
    bloodType: student.bloodType ?? "",
    religionId: student.religionId ?? "",
    clubs: student.clubs.map((club) => club.club.id),
    sports: student.sports.map((sport) => sport.sport.id),
    isBaptized: student.isBaptized,
    tags: Array.isArray(student.tags)
      ? student.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    registrationNumber: student.registrationNumber ?? "",
    externalAccountingNo: student.externalAccountingNo ?? "",
    phoneNumber: student.phoneNumber ?? "",
    residence: student.residence ?? "",
    allergies: student.allergies ?? "",
    observation: student.observation ?? "",
  };

  const initialAcademicValues = {
    classroomId: student.classroom?.id ?? "",
    dateOfEntry: student.dateOfEntry ?? new Date(),
    dateOfExit: student.dateOfExit ?? undefined,
    isRepeating: student.isRepeating,
    isNew: student.isNew,
    status: student.status,
    formerSchoolId: student.formerSchoolId ?? "",
  };

  const initialSelectedParents = student.studentContacts.map(
    (studentContact) => {
      return {
        id: studentContact.contactId,
        name: getFullName(studentContact.contact).trim(),
        relationshipId: studentContact.relationshipId?.toString() ?? "",
      };
    },
  );

  return (
    <HydrateClient>
      <StudentFormProvider
        initialBasicValues={initialBasicValues}
        initialAcademicValues={initialAcademicValues}
        initialSelectedParents={initialSelectedParents}
      >
        <CreateEditStudent student={student} />
      </StudentFormProvider>
    </HydrateClient>
  );
}
