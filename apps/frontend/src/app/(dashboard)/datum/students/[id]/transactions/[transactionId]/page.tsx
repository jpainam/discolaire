import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { auth } from "@repo/auth";
import { getServerTranslations } from "@repo/i18n/server";
import { numberToWords } from "@repo/lib/toword";
import { EmptyState } from "@repo/ui/EmptyState";
import FlatBadge from "@repo/ui/FlatBadge";
import { Separator } from "@repo/ui/separator";

import { routes } from "~/configs/routes";
import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/server";
import { getFullName } from "~/utils/full-name";

export default async function Page({
  params: { id, transactionId },
}: {
  params: { id: string; transactionId: number };
}) {
  const transaction = await api.transaction.get(Number(transactionId));
  const session = await auth();
  const user = session?.user;

  if (!transaction || !user) {
    notFound();
  }
  const school = await api.school.get(user.schoolId);

  const classroom = await api.student.classroom({
    studentId: id,
    schoolYearId: transaction.schoolYearId,
  });
  if (!classroom) {
    return <EmptyState className="my-8" title="student_not_registered_yet" />;
  }
  const { t, i18n } = await getServerTranslations();
  const studentAccount = await api.studentAccount.get(transaction.accountId);
  if (studentAccount?.studentId !== id) {
    redirect(routes.students.transactions.index(id));
  }

  const student = await api.student.get(studentAccount.studentId);
  const studentContact = await api.student.contacts(studentAccount.studentId);
  // Get the primary contact
  let contact = studentContact.find((c) => c.primaryContact)?.contact;
  if (!contact) {
    contact = studentContact[0]?.contact;
  }
  // Get fees, remaining, and paid
  const fees = await api.classroom.fees(classroom.id);
  const totalFee = fees.reduce((acc, fee) => acc + fee.amount, 0);
  const transactions = await api.student.transactions(id);
  const paid = transactions.reduce((acc, t) => acc + t.amount, 0);
  const remaining = totalFee - paid;

  // Get the staff who created, printed and received the transaction
  const createdBy = transaction.createdById
    ? await api.staff.get(transaction.createdById)
    : null;
  const printedBy = transaction.printedById
    ? await api.staff.get(transaction.printedById)
    : null;
  const receivedBy = transaction.receivedById
    ? await api.staff.get(transaction.receivedById)
    : null;

  const fullDateFormatter = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <>
      <div className="relative mx-auto overflow-hidden rounded-md border p-4 2xl:w-1/2">
        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
          <Image
            src="/images/logo.png?height=350&width=350"
            alt="Watermark"
            width={350}
            height={350}
            className="object-contain"
          />
        </div>

        {/* Receipt content */}
        <div className="relative z-10">
          {/* <h1 className="mb-4 text-2xl font-bold text-red-700">Reçu de caisse</h1> */}

          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Image
                src="/images/logo.png?height=100&width=100"
                alt="Institut Logo"
                width={200}
                height={500}
              />
            </div>
            <div className="text-right">
              <p className="font-bold">{school?.name}</p>
              <p>{school?.address}</p>
              <p>
                {t("phoneNumber")} : {school?.phoneNumber1}
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
      {/* <PdfReceiptDownloadButton
        remaining={remaining}
        amount={transaction.amount}
        classroomName={classroom.name}
        contactName={contact?.lastName ?? ""}
        contactPhoneNumber={contact?.phoneNumber1 ?? ""}
        contactPrefix={contact?.prefix ?? ""}
        createdBy={createdBy?.lastName ?? ""}
        createdByPrefix={createdBy?.prefix ?? ""}
        createdAt={fullDateFormatter.format(transaction.createdAt)}
        printedBy={printedBy?.lastName ?? ""}
        printedByPrefix={printedBy?.prefix ?? ""}
        printedAt={
          (transaction.printedAt &&
            fullDateFormatter.format(transaction.printedAt)) ??
          ""
        }
        receivedBy={receivedBy?.lastName ?? ""}
        receivedByPrefix={receivedBy?.prefix ?? ""}
        receivedAt={
          (transaction.receivedAt &&
            fullDateFormatter.format(transaction.receivedAt)) ??
          ""
        }
      /> */}
    </>
  );
}
