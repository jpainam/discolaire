import { EmptyState } from "~/components/EmptyState";
import { PermissionTable } from "~/components/users/PermissionTable";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const staff = await api.staff.get(params.id);
  const { t } = await getServerTranslations();
  if (!staff.userId) {
    return <EmptyState className="my-8" title={t("no_user_attached_yet")} />;
  }

  return (
    <div className="p-2 2xl:p-4">
      <PermissionTable userId={staff.userId} />
    </div>
  );
}
