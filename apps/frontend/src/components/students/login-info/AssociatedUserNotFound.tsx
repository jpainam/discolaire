"use client";

import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import { TriangleAlert } from "lucide-react";

export function AssociatedUserNotFound({ className }: { className?: string }) {
  const { t } = useLocale();
  return (
    <Card className={cn("max-w-[450px] justify-center", className)}>
      <CardHeader className="flex flex-row items-start border-b bg-muted/50 p-2">
        <CardTitle className="text-md group flex items-center gap-2">
          <TriangleAlert className="h-5 w-5" /> {t("no_data")}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-destructive/5 p-4 text-sm">
        <Alert variant="destructive">
          <AlertDescription className="text-destructive">
            {t("no_associated_user_found")}
          </AlertDescription>
        </Alert>
        <div className="m-2">{t("contactAdministratorForAccess")}</div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-row items-center bg-muted/50 px-2 py-1">
        <div className="ml-auto mr-0 w-auto">
          <Button variant={"outline"} size={"sm"}>
            {t("associate_user")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
