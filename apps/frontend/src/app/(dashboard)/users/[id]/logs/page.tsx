import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { auth } from "~/auth/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const t = await getTranslations();
  const { sessions } = await auth.api.listUserSessions({
    body: {
      userId: params.id,
    },
    headers: await headers(),
  });
  const locale = await getLocale();
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">ID</TableHead>
              <TableHead className="h-9 py-2">{t("createAt")}</TableHead>
              <TableHead className="h-9 py-2">{t("expiresAt")}</TableHead>
              <TableHead className="h-9 py-2">{t("ipAddress")}</TableHead>
              <TableHead className="h-9 py-2">{t("userAgent")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((sess, index) => (
              <TableRow key={index}>
                <TableCell className="py-2 font-medium">{sess.id}</TableCell>
                <TableCell className="py-2">
                  {sess.createdAt.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell className="py-2">
                  {sess.expiresAt.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell className="py-2">{sess.ipAddress}</TableCell>
                <TableCell className="py-2">{sess.userAgent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
