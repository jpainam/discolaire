"use client";

import { Mail, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";

import { Alert, AlertDescription } from "./alert";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { cn } from "./utils";

interface NoPermissionProps {
  resourceText?: string;
  isFullPage?: boolean;
  className?: string;
}

export const NoPermission = ({
  resourceText = "",
  isFullPage = false,
  className,
}: NoPermissionProps) => {
  const { t } = useLocale();
  const NoPermissionMessage = ({ className }: { className?: string }) => (
    <Card className={cn("max-w-[450px] justify-center", className)}>
      <CardHeader className="flex flex-row items-start border-b bg-muted/50 p-2">
        <CardTitle className="text-md group flex items-center gap-2">
          <TriangleAlert className="h-5 w-5" />{" "}
          {t("additionalPermissionsRequired")}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-destructive/5 p-4 text-sm">
        <Alert variant="destructive">
          <AlertDescription className="text-destructive">
            {t("youNeedAdditionalPermissionTo")}
          </AlertDescription>
        </Alert>
        <div className="m-2">{t("contactAdministratorForAccess")}</div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-2 py-1">
        <div className="ml-auto mr-0 w-auto">
          <Button
            onClick={() => {
              toast.info(t("not_yet_implemented"));
            }}
            size="sm"
            variant="outline"
          >
            <Mail className="mr-2 h-4 w-4" />
            {t("contactAdministrator")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  if (isFullPage) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center",
          className,
        )}
      >
        <NoPermissionMessage />
      </div>
    );
  } else {
    return <NoPermissionMessage className={className} />;
  }
};
