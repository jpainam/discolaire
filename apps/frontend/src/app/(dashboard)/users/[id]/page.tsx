import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await api.user.get(params.id);
  if (!user) return null;
  const { t } = await getServerTranslations();
  <div className="flex flex-col gap-2">
    <Label>{t("username")}</Label>
    <p>{user.username}</p>
    <Label>{t("email")}</Label>
    <p>{user.email}</p>
    <Label>{t("roles")}</Label>
    {/* <p>{user.roles.join(", ")}</p> */}
  </div>;
}
