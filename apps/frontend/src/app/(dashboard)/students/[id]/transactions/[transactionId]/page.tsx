import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { Separator } from "@repo/ui/components/separator";
import FlatBadge from "~/components/FlatBadge";
import { getServerTranslations } from "~/i18n/server";

import { routes } from "~/configs/routes";
import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/server";
import { getFullName } from "~/utils/full-name";
import { numberToWords } from "~/lib/toword";

export default async function Page(props: {
  params: Promise<{ id: string; transactionId: number }>;
}) {
  const params = await props.params;

  const { id, transactionId } = params;

  const transaction = await api.transaction.get(Number(transactionId));
  if (!transaction) {
    notFound();
  }
  const {
    student,
    createdBy,
    printedBy,
    receivedBy,
    classroom,
    school,
    contact,
    remaining,
  } = await api.transaction.getReceiptInfo(transactionId);

  const { t, i18n } = await getServerTranslations();
  const studentAccount = await api.studentAccount.get(transaction.accountId);
  if (studentAccount?.studentId !== id) {
    redirect(routes.students.transactions.index(id));
  }

  const fullDateFormatter = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <>
      <div className="relative mx-2 overflow-hidden rounded-md border p-4">
        {/* Watermark */}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
          <Image
            src={`${school.logo}?height=350&width=350`}
            alt="Watermark"
            width={350}
            height={350}
            className="object-contain"
          />
        </div>

        {/* Receipt content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Image
                src={`${school.logo}?height=100&width=100`}
                alt="Institut Logo"
                width={200}
                height={500}
              />
            </div>
            <div className="text-right">
              <p className="font-bold">{school.name}</p>
              <p>{school.address}</p>
              <p>
                {t("phoneNumber")} : {school.phoneNumber1}
              </p>
              <p>************</p>
            </div>
          </div>

          <div className="mb-2 text-center">
            <h2 className="text-xl font-bold">{getFullName(student)}</h2>
            <p className="text-lg font-bold">{transaction.transactionRef}</p>
          </div>
          <Separator className="mb-2" />
          <div className="mb-2 flex justify-between">
            <div>
              {/* <p>
              <span className="font-bold">Reçu de</span> : NYA TCHATAT
              ANNE-SARAH
            </p> */}
              <p>
                <span className="font-bold uppercase">{t("for")}</span> :{" "}
                {transaction.description}
              </p>
              <p>
                <span className="font-bold uppercase">{t("amount")}</span> :
                {transaction.amount.toLocaleString(i18n.language, {
                  style: "currency",
                  currency: CURRENCY,
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}{" "}
                ({numberToWords(transaction.amount, i18n.language)} )
              </p>
              <p>
                <span className="font-bold uppercase">{t("remaining")}</span> :{" "}
                {remaining.toLocaleString(i18n.language, {
                  style: "currency",
                  currency: CURRENCY,
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">
                {t("classroom")} : {classroom.name}
              </p>
              <FlatBadge
                variant={"gray"}
                className="rounded-lg border px-2 text-lg font-bold"
              >
                {t("amount")} : #{transaction.amount}#
              </FlatBadge>
            </div>
          </div>

          <div className="mb-2 flex justify-between text-sm">
            <div>
              <p>
                S/C {contact?.prefix} {contact?.lastName}
              </p>
              <p>
                {t("phone")}: {contact?.phoneNumber1}
              </p>
            </div>
            <div className="text-right">
              <p>
                {t("recorded_by")} {createdBy?.prefix} {createdBy?.lastName}
              </p>
              <p>{fullDateFormatter.format(transaction.createdAt)}</p>
            </div>
          </div>

          <div className="flex justify-between gap-2 text-sm">
            <div className="flex flex-col">
              <span>
                {t("printed_by")} {printedBy?.prefix} {printedBy?.lastName}{" "}
              </span>
              <span>
                {transaction.printedAt &&
                  fullDateFormatter.format(transaction.printedAt)}
              </span>
            </div>
            <div className="flex flex-col">
              <span>
                {t("received_by")} {receivedBy?.prefix} {receivedBy?.lastName}
              </span>
              <span>
                {transaction.receivedAt &&
                  fullDateFormatter.format(transaction.receivedAt)}
              </span>
            </div>
          </div>

          {/* <div className="mt-4 text-center">
          <p className="text-xs">Le chemin de la réussite scolaire</p>
          <p className="text-xs">The road to academic success</p>
        </div> */}
        </div>
      </div>
    </>
  );
}
