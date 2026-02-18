import { headers } from "next/headers";
import { getLocale } from "next-intl/server";

import { getAuth } from "~/auth/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getQueryClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = params.id;
  const queryClient = getQueryClient();
  const user = await queryClient.fetchQuery(trpc.user.get.queryOptions(userId));
  const auth = await getAuth();
  const { sessions } = await auth.api.listUserSessions({
    body: {
      userId,
    },

    headers: await headers(),
  });
  const lastSession = sessions.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];
  const locale = await getLocale();
  return (
    <div className="grid grid-cols-1 items-start gap-4 p-4 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">
            Dernière connexion:{" "}
            {lastSession?.updatedAt.toLocaleDateString(locale, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </CardFooter>
      </Card>
      <div className="col-span-2 grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Mes roles</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
      <div className="col-span-full">
        <Card>
          <CardHeader>
            <CardTitle>Mes permissions</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <p>Liste of permission group by module</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
