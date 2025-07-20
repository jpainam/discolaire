import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { getServerTranslations } from "~/i18n/server";

export default async function Page(props: {
  searchParams: Promise<{ email: string }>;
}) {
  const searchParams = await props.searchParams;
  const { t } = await getServerTranslations();
  if (!searchParams.email) {
    return (
      <div className="bg-muted flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("error")}</CardTitle>
            <CardDescription>
              {t("invalid_email_address_please_try_again")}.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-lg">
            {t("successfully_unsubscribed")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t("successfully_unsubscribed_description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-muted-foreground text-sm">
            {t("you_will_no_longer_receive_emails")}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" variant="outline">
            <Link
              href={`/subscribe?email${searchParams.email}`}
              className="w-full"
            >
              {t("resubscribe")}
            </Link>
          </Button>
          <Button className="w-full">
            <Link href="/" className="w-full">
              {t("back_to_home")}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
