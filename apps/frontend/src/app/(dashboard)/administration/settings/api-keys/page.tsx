import { headers } from "next/headers";
import { getLocale } from "next-intl/server";

import { getAuth } from "~/auth/server";
import { EmptyComponent } from "~/components/EmptyComponent";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { caller } from "~/trpc/server";
import { CreateAuthApiKey } from "./CreateAuthApiKey";
import { DeleteAuthApiKey } from "./DeleteAuthApiKey";

export default async function Page() {
  const requestHeaders = await headers();
  const auth = await getAuth(requestHeaders);
  const apikeys = await auth.api.listApiKeys({
    headers: requestHeaders,
  });
  const locale = await getLocale();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row items-center">
        <div className="ml-auto">
          <CreateAuthApiKey />
        </div>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nom</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead>UserId</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Dernière requête</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apikeys.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  <EmptyComponent />
                </TableCell>
              </TableRow>
            )}
            {apikeys.map(async (item, index) => {
              const user = await caller.user.get(item.userId);
              return (
                <TableRow key={index}>
                  <TableCell className="py-2 font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    {item.enabled ? (
                      <Badge variant="outline" className="gap-1.5">
                        <span
                          className="size-1.5 rounded-full bg-emerald-500"
                          aria-hidden="true"
                        ></span>
                        Actif
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1.5">
                        <span
                          className="size-1.5 rounded-full bg-red-500"
                          aria-hidden="true"
                        ></span>
                        Désactivé
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{item.prefix}</TableCell>
                  <TableCell>
                    {item.lastRequest?.toLocaleDateString(locale, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell align="right">
                    <DeleteAuthApiKey apiKeyId={item.id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
