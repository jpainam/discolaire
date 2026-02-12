import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { getQueryClient, trpc } from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(params.id),
  );
  const t = await getTranslations();
  return (
    <div>
      <BreadcrumbsSetter
        items={[
          { label: t("students"), href: "/students" },
          { label: getFullName(student), href: `/students/${params.id}` },
          { label: t("timetable"), href: `/students/${params.id}/timetables` },
        ]}
      />
      Student timetable
    </div>
  );
}
