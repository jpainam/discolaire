import React from "react";

import { getServerTranslations } from "@repo/i18n/server";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getServerTranslations();
  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle className="flex flex-row">
          {t("schools")}{" "}
          <div className="ml-auto flex gap-4">
            <Button variant={"outline"}>{t("export")}</Button>
          </div>
        </CardTitle>
        <CardDescription>
          {t("school_page_description")}
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
