import Image from "next/image";
import { notFound } from "next/navigation";

import { getServerTranslations } from "@repo/i18n/server";
import { Avatar, AvatarImage } from "@repo/ui/avatar";
import { Separator } from "@repo/ui/separator";

import { Avatar01, Logo } from "~/components/raw-images";
import { IdCardBarCode } from "~/components/students/idcard/id-barcode";
import { IdCardHeader } from "~/components/students/idcard/IdCardHeader";
import { api } from "~/trpc/server";
import { getFullName } from "~/utils/full-name";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { t } = await getServerTranslations();
  const student = await api.student.get(id);
  if (!student) {
    notFound();
  }
  return (
    <div className="flex flex-col">
      <IdCardHeader />
      <Separator />
      <div className="flex flex-col items-center p-4">
        <div className="flex h-[350px] w-[550px] flex-col rounded-xl border-2 border-[#002D5D] bg-[url('/images/bg-idcard.webp')] bg-cover bg-scroll bg-no-repeat">
          <div className="relative">
            {student.avatar && (
              <Avatar className="absolute left-5 top-10 h-[150px] w-[150px] rounded-lg shadow-lg">
                <AvatarImage src={student.avatar ?? ""} alt="Avatar" />
              </Avatar>
            )}
            {!student.avatar && (
              <Image
                src={Avatar01}
                className="absolute left-5 top-10 rounded-lg shadow-lg"
                height={150}
                width={150}
                alt="Photo"
              />
            )}
          </div>
          <div className="flex h-[250px] justify-end px-4 text-right">
            <span className="text-3xl font-bold tracking-tighter">
              Portail Scolaire <br />
              de Diourbel
            </span>
          </div>
          <div className="flex h-[100px] items-center justify-end bg-[#002D5D] px-4 text-2xl font-semibold uppercase tracking-tight text-[#E4EEF8]">
            {t("id_card")}
          </div>
          <div className="grid h-full w-full grid-cols-3 gap-4 rounded-b-xl bg-[#E4EEF8] text-[#002D5D]">
            <div className="ml-[10px] mt-[80px] flex flex-col gap-4 pl-2">
              <span className="text-xl font-bold uppercase tracking-tighter">
                {getFullName(student)}
              </span>
              <span className="font-mono text-sm uppercase">
                {t("dateOfBirth")}{" "}
                {student.dateOfBirth &&
                  Intl.DateTimeFormat().format(new Date(student.dateOfBirth))}
              </span>
            </div>
            <div className="col-span-2 mt-[10px]">
              <div className="font-mono uppercase">
                {t("cardNumber")}: 1234567890
              </div>
              <div className="font-mono uppercase">
                {t("issued")}: 01.01.2023
              </div>
              <div className="font-mono uppercase">
                {t("expired")}: 01.01.2024
              </div>
              <div className="mt-10 flex flex-row pb-1">
                <IdCardBarCode
                  width={2}
                  height={40}
                  backgroundColor="#E4EEF8"
                  id={"1234567890"}
                />
                <Image src={Logo} height={40} width={120} alt="Logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//  className="rounded-xl border-2 bg-[url('/public/images/id-card.webp')]"
// h-screen
