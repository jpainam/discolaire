import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ErrorFallback } from "~/components/error-fallback";
import { NoPermission } from "~/components/no-permission";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Skeleton } from "~/components/ui/skeleton";
import { checkPermission } from "~/permissions/server";
import { HydrateClient } from "~/trpc/server";
import CreateEditStaff from "./CreateEditStaff";

export default async function Page() {
  const canCreateStaff = await checkPermission("staff.create");
  if (!canCreateStaff) {
    return <NoPermission />;
  }
  const t = await getTranslations();

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4 p-4">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Card>
            <CardHeader>
              <CardTitle>Créer un personnel</CardTitle>
              <CardDescription>
                Veuillez vérifier si le personnel n'existe pas déjà
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <InputGroup>
                  <InputGroupInput placeholder={t("search")} />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
                <Button>{t("search")}</Button>
              </div>
            </CardContent>
          </Card>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid gap-4 p-4 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton className="h-20" key={index} />
                ))}
              </div>
            }
          >
            <CreateEditStaff />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
