import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { Avatar, AvatarImage } from "@repo/ui/components/avatar";
import { Card } from "@repo/ui/components/card";

import { randomAvatar } from "~/components/raw-images";
import { IdCardBarCode } from "~/components/students/idcard/id-barcode";
import { IdCardHeader } from "~/components/students/idcard/IdCardHeader";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";

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
    <div>
      <IdCardHeader />
      <div className="mx-auto grid gap-6 p-4 md:grid-cols-2">
        {/* Front of the card */}
        <Card className="card-face card-front overflow-hidden rounded-xl border-2 border-[#0a2d5e] p-0 shadow-md">
          {/* Header */}
          <div className="border-b-2 border-[#0a2d5e] p-2">
            <h2 className="text-center text-lg font-bold sm:text-xl">
              {school.name}
            </h2>
          </div>

          {/* Blue band */}
          <div className="flex justify-end bg-[#0a2d5e] p-2">
            <h3 className="text-xl font-bold text-white uppercase sm:text-2xl">
              {t("id_card")}
            </h3>
          </div>

          {/* Main content */}
          <div className="flex h-full bg-[#e6f0fa] p-4 dark:bg-[#121e29]">
            {/* Left column with photo and name */}
            <div className="flex w-2/5 flex-col">
              <div className="mb-4 overflow-hidden rounded-md p-2">
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
              <p className="text-lg leading-tight font-bold text-[#0a2d5e] dark:text-[#c7d9f2]">
                {getFullName(student)}
              </p>

              <div className="mt-auto">
                <p className="text-sm font-bold text-[#0a2d5e] dark:text-[#c7d9f2]">
                  DATE DE
                </p>
                <p className="text-sm font-bold text-[#0a2d5e] dark:text-[#c7d9f2]">
                  NAISSANCE
                </p>
                <p className="text-sm font-bold text-[#0a2d5e] dark:text-[#c7d9f2]">
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
            <div className="flex w-3/5 flex-col pl-4">
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

              <div className="mt-auto flex items-end justify-between">
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
                <div className="w-2/5 rounded-md p-1">
                  {school.logo && (
                    <Image
                      src={`/api/download/images/${school.logo}`}
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
        <Card className="card-face card-back overflow-hidden rounded-xl border-2 border-[#0a2d5e] p-0 shadow-md">
          {/* Header */}
          <div className="border-b-2 border-[#0a2d5e] p-2">
            <h2 className="text-center text-lg font-bold sm:text-xl">
              {school.name}
            </h2>
          </div>

          {/* Blue band */}
          <div className="flex justify-center bg-[#0a2d5e] p-2">
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              RÈGLEMENT INTÉRIEUR
            </h3>
          </div>

          {/* Main content */}
          <div className="bg-[#e6f0fa] p-4 dark:bg-[#121e29]">
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-bold text-[#0a2d5e] dark:text-[#c7d9f2]">
                RÈGLES DE L'ÉTABLISSEMENT:
              </h4>
              <ul className="list-disc space-y-1 pl-4 text-xs text-[#0a2d5e] dark:text-[#c7d9f2]">
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
              <h4 className="mb-2 text-sm font-bold text-[#0a2d5e] dark:text-[#c7d9f2]">
                CONTACT:
              </h4>
              <p className="text-xs text-[#0a2d5e] dark:text-[#c7d9f2]">
                BP 1234, Yaoundé, Cameroun
              </p>
              <p className="text-xs text-[#0a2d5e] dark:text-[#c7d9f2]">
                Tel: (+237) 222 222 222
              </p>
              <p className="text-xs text-[#0a2d5e] dark:text-[#c7d9f2]">
                Email: info@ipbwague.cm
              </p>
              <p className="text-xs text-[#0a2d5e] dark:text-[#c7d9f2]">
                www.ipbwague.cm
              </p>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div className="w-1/2">
                <p className="mb-1 text-xs font-bold text-[#0a2d5e] dark:text-[#c7d9f2]">
                  EN CAS DE PERTE:
                </p>
                <p className="text-xs text-[#0a2d5e] dark:text-[#c7d9f2]">
                  Si vous trouvez cette carte, veuillez la retourner à l'adresse
                  ci-dessus ou appeler le numéro indiqué.
                </p>
              </div>

              <div className="w-1/3">
                {/* School logo */}
                {school.logo && (
                  <Image
                    src={`/api/download/images/${school.logo}`}
                    height={40}
                    width={120}
                    alt="Logo"
                    className="rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="mt-4 border-t border-[#0a2d5e] pt-2">
              <p className="text-center text-xs font-bold text-[#0a2d5e] dark:text-[#c7d9f2]">
                "Le chemin de la réussite scolaire / The road to academic
                success"
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
