import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";
import { TrimestreHeader } from "./TrimestreHeader";
export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    trimestreId: string;
    classroomId: string;
    studentId: string;
    format: string;
  }>;
}) {
  const params = await props.params;
  const { id } = params;
  const { t } = await getServerTranslations();
  const classroom = await api.student.classroom({ studentId: id });
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }
  const searchParams = await props.searchParams;
  const { trimestreId } = searchParams;
  const { title, seq1, seq2 } = getTitle({ trimestreId });
  return (
    <div className="flex flex-col gap-4">
      <TrimestreHeader
        trimestreId={trimestreId}
        studentId={params.id}
        title={title}
        classroomId={classroom.id}
      />
      <div className="px-4">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[10px]"></TableHead>
                <TableHead>{t("subject")}</TableHead>
                <TableHead>{seq1}</TableHead>
                <TableHead>{seq2}</TableHead>
                <TableHead>{t("moy")}</TableHead>
                <TableHead>{t("coeff")}</TableHead>
                <TableHead>{t("total")}</TableHead>
                <TableHead>{t("rank")}</TableHead>
                <TableHead>{t("Moy.C")}</TableHead>
                <TableHead>{t("Min/Max")}</TableHead>
                <TableHead>{t("appreciation")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function getTitle({ trimestreId }: { trimestreId: string }) {
  if (trimestreId == "trim1") {
    return {
      title: "BULLETIN SCOLAIRE DU PREMIER TRIMESTRE",
      seq1: "SEQ1",
      seq2: "SEQ2",
    };
  }
  if (trimestreId == "trim2") {
    return {
      title: "BULLETIN SCOLAIRE DU SECOND TRIMESTRE",
      seq1: "SEQ3",
      seq2: "SEQ4",
    };
  }
  return {
    title: "BULLETIN SCOLAIRE DU TROISIEME TRIMESTRE",
    seq1: "SEQ5",
    seq2: "SEQ6",
  };
}
