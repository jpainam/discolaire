import { EmptyComponent } from "~/components/EmptyComponent";
import { PermissionTable } from "~/components/users/PermissionTable";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const staff = await caller.staff.get(params.id);
  const { t } = await getServerTranslations();
  if (!staff.userId) {
    return <EmptyComponent title={t("no_user_attached_yet")} />;
  }

  return (
    <div className="p-2 2xl:p-4">
      <PermissionTable userId={staff.userId} />
    </div>
  );
}
