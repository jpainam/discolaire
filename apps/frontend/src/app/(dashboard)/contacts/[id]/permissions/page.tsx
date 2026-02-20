import { getSession } from "~/auth/server";
import { EmptyComponent } from "~/components/EmptyComponent";
import { NoPermission } from "~/components/no-permission";
import { UserPermissionsPageClient } from "~/components/users/UserPermissionsPageClient";
import { checkPermission } from "~/permissions/server";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const session = await getSession();
  if (session?.user.profile !== "staff") {
    return <NoPermission />;
  }

  const canUpdatePermission = await checkPermission("permission.update");
  if (!canUpdatePermission) {
    return <NoPermission />;
  }

  const queryClient = getQueryClient();
  const contact = await queryClient.fetchQuery(
    trpc.contact.get.queryOptions(id),
  );

  if (!contact.userId) {
    return (
      <EmptyComponent
        title="Pas d'utilisateur"
        description="Vous devez d'abord créer le compte utilisateur pour ce contact"
      />
    );
  }

  const userId = contact.userId;

  void queryClient.prefetchQuery(trpc.role.all.queryOptions());
  void queryClient.prefetchQuery(trpc.user.getPermissions.queryOptions(userId));
  void queryClient.prefetchQuery(trpc.module.all.queryOptions());
  void queryClient.prefetchQuery(trpc.permission.all.queryOptions());

  return (
    <HydrateClient>
      <UserPermissionsPageClient userId={userId} />
    </HydrateClient>
  );
}
