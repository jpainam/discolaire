import { Avatar, AvatarImage } from "@repo/ui/components/avatar";
import { Card } from "@repo/ui/components/card";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { randomAvatar } from "~/components/raw-images";
import { IdCardBarCode } from "~/components/students/idcard/id-barcode";
import { IdCardHeader } from "~/components/students/idcard/IdCardHeader";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils/full-name";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const { t, i18n } = await getServerTranslations();
  const student = await caller.student.get(id);
  const schoolYear = await caller.schoolYear.getCurrent();
  const school = await caller.school.get(student.schoolId);
  if (student.schoolId !== school.id) {
    notFound();
  }

  return (
    <>
      <IdCardHeader />
      <div className="mx-auto  grid md:grid-cols-2 p-4 gap-6">
        {/* Front of the card */}
        <Card className="card-face p-0 card-front rounded-xl overflow-hidden border-2 border-[#0a2d5e] shadow-md">
          {/* Header */}
          <div className=" p-2 border-b-2 border-[#0a2d5e]">
            <h2 className=" font-bold text-center text-lg sm:text-xl">
              {school.name}
            </h2>
          </div>

          {/* Blue band */}
          <div className="bg-[#0a2d5e] p-2 flex justify-end">
            <h3 className="text-white uppercase font-bold text-xl sm:text-2xl">
              {t("id_card")}
            </h3>
          </div>

          {/* Main content */}
          <div className="bg-[#e6f0fa] dark:bg-[#121e29] h-full p-4 flex">
            {/* Left column with photo and name */}
            <div className="w-2/5 flex flex-col">
              <div className=" rounded-md overflow-hidden mb-4 p-2">
                {student.user?.avatar && (
                  <Avatar className="h-[150px] w-[150px] rounded-lg shadow-lg">
                    <AvatarImage src={student.user.avatar} alt="Avatar" />
                  </Avatar>
                )}
                {!student.user?.avatar && (
                  <Image
                    src={randomAvatar()}
                    className="rounded-lg shadow-lg"
                    height={150}
                    width={150}
                    alt="Photo"
                  />
                )}
              </div>

              {/* <div className="flex flex-col"> */}
              <p className="text-[#0a2d5e] dark:text-[#c7d9f2] font-bold text-lg leading-tight">
                {getFullName(student)}
              </p>

              <div className="mt-auto">
                <p className="text-[#0a2d5e] dark:text-[#c7d9f2] text-sm font-bold">
                  DATE DE
                </p>
                <p className="text-[#0a2d5e] dark:text-[#c7d9f2] text-sm font-bold">
                  NAISSANCE
                </p>
                <p className="text-[#0a2d5e] dark:text-[#c7d9f2] text-sm font-bold">
                  {student.dateOfBirth?.toLocaleDateString(i18n.language, {
                    timeZone: "UTC",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Right column with details and barcode */}
            <div className="w-3/5 pl-4 flex flex-col">
              <div className="font-mono text-[#0a2d5e] dark:text-[#c7d9f2]">
                <p className="mb-2 uppercase">
                  {t("registration_number")}: {student.registrationNumber}
                </p>
                <p className="mb-2 uppercase">
                  {t("issued")}: {format(schoolYear.startDate, "dd/MM/yyyy")}
                </p>
                <p className="mb-2 uppercase">
                  {t("expires")}: {format(schoolYear.endDate, "dd/MM/yyyy")}
                </p>
              </div>

              <div className="mt-auto flex justify-between items-end">
                {/* Barcode */}
                <div className="w-3/5">
                  <IdCardBarCode
                    width={2}
                    height={40}
                    backgroundColor="#E4EEF8"
                    id={"123456789012"}
                  />
                </div>

                {/* School logo */}
                <div className="w-2/5 p-1 rounded-md">
                  {school.logo && (
                    <Image
                      src={school.logo}
                      height={40}
                      width={120}
                      alt="Logo"
                      className="rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Back of the card */}
        <Card className="card-face p-0 card-back rounded-xl overflow-hidden border-2 border-[#0a2d5e] shadow-md">
          {/* Header */}
          <div className="p-2 border-b-2 border-[#0a2d5e]">
            <h2 className="font-bold text-center text-lg sm:text-xl">
              {school.name}
            </h2>
          </div>

          {/* Blue band */}
          <div className="bg-[#0a2d5e] p-2 flex justify-center">
            <h3 className="text-white font-bold text-xl sm:text-2xl">
              RÈGLEMENT INTÉRIEUR
            </h3>
          </div>

          {/* Main content */}
          <div className="bg-[#e6f0fa] dark:bg-[#121e29] p-4">
            <div className="mb-4">
              <h4 className="text-[#0a2d5e] dark:text-[#c7d9f2] font-bold text-sm mb-2">
                RÈGLES DE L'ÉTABLISSEMENT:
              </h4>
              <ul className="text-[#0a2d5e] dark:text-[#c7d9f2] text-xs space-y-1 list-disc pl-4">
                <li>Cette carte doit être portée visiblement en tout temps</li>
                <li>
                  La carte est strictement personnelle et non transférable
                </li>
                <li>
                  En cas de perte, informer immédiatement l'administration
                </li>
                <li>Frais de remplacement: 5000 FCFA</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-[#0a2d5e] dark:text-[#c7d9f2] font-bold text-sm mb-2">
                CONTACT:
              </h4>
              <p className="text-[#0a2d5e] dark:text-[#c7d9f2] text-xs">
                BP 1234, Yaoundé, Cameroun
              </p>
              <p className="text-[#0a2d5e] dark:text-[#c7d9f2] text-xs">
                Tel: (+237) 222 222 222
              </p>
              <p className="text-[#0a2d5e] dark:text-[#c7d9f2] text-xs">
                Email: info@ipbwague.cm
              </p>
              <p className="text-[#0a2d5e] dark:text-[#c7d9f2] text-xs">
                www.ipbwague.cm
              </p>
            </div>

            <div className="flex justify-between items-end mt-4">
              <div className="w-1/2">
                <p className="text-[#0a2d5e] dark:text-[#c7d9f2] text-xs font-bold mb-1">
                  EN CAS DE PERTE:
                </p>
                <p className="text-[#0a2d5e] dark:text-[#c7d9f2] text-xs">
                  Si vous trouvez cette carte, veuillez la retourner à l'adresse
                  ci-dessus ou appeler le numéro indiqué.
                </p>
              </div>

              <div className="w-1/3">
                {/* School logo */}
                {school.logo && (
                  <Image
                    src={school.logo}
                    height={40}
                    width={120}
                    alt="Logo"
                    className="rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="mt-4 border-t border-[#0a2d5e] pt-2">
              <p className="text-[#0a2d5e] dark:text-[#c7d9f2] text-xs text-center font-bold">
                "Le chemin de la réussite scolaire / The road to academic
                success"
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
