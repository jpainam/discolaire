"use client";

import { Mail, ShieldAlert } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";

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
  //const { t } = useLocale();
  const NoPermissionMessage = ({ className }: { className?: string }) => (
    <Card className={cn("mx-auto my-4 w-full max-w-md", className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border bg-yellow-100">
          <ShieldAlert className="h-6 w-6 text-yellow-600" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Permission Required {resourceText}
        </CardTitle>
        <CardDescription className="text-gray-500">
          You don't have the necessary permissions to access this content.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-gray-600">
          If you believe this is an error or need access, please contact the
          administration for assistance.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button size={"sm"} className="flex items-center">
          <Mail className="h-4 w-4" />
          Contact Administration
        </Button>
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
