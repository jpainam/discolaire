import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  BookMarkedIcon,
  Globe,
  LocateFixedIcon,
  Mail,
  MapPin,
  MapPinHouse,
  NavigationIcon,
  NotebookIcon,
  Phone,
  UserIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";

import { getSession } from "~/auth/server";
import { ErrorFallback } from "~/components/error-fallback";
import FlatBadge from "~/components/FlatBadge";
import { NoPermission } from "~/components/no-permission";
import { env } from "~/env";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { DefaultSettings } from "./DefaultSettings";
import { SchoolDetailAction } from "./SchoolDetailAction";

export default async function Page(props: {
  params: Promise<{ schoolId: string }>;
}) {
  const params = await props.params;

  const { schoolId } = params;

  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  const queryClient = getQueryClient();
  const school = await queryClient.fetchQuery(
    trpc.school.get.queryOptions(schoolId),
  );

  if (
    school.id !== session.user.schoolId &&
    session.user.username !== env.SUPER_ADMIN_USERNAME
  ) {
    return <NoPermission />;
  }
  const canReadSchool = await checkPermission("school", PermissionAction.READ);
  if (!canReadSchool) return <NoPermission />;

  const canUpdateSchool = await checkPermission(
    "school",
    PermissionAction.UPDATE,
  );

  const t = await getTranslations();
  return (
    <HydrateClient>
      <div className="flex flex-col gap-2 text-sm">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-6">
              {school.logo && (
                <Image
                  src={`/api/download/images/${school.logo}`}
                  alt={school.code}
                  width={80}
                  height={80}
                />
              )}
              <span className="text-xl">{school.name}</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              ID: {school.id}
            </CardDescription>

            <CardAction className="flex flex-row items-center space-x-2">
              <FlatBadge variant={school.isActive ? "green" : "red"}>
                {school.isActive ? t("active") : t("inactive")}
              </FlatBadge>
              {canUpdateSchool && <SchoolDetailAction schoolId={schoolId} />}
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <InfoItem
                label={t("authorization")}
                value={school.authorization}
                icon={<BookMarkedIcon className="h-4 w-4" />}
              />
              <InfoItem
                label={t("ministry")}
                value={school.ministry}
                icon={<NotebookIcon className="h-4 w-4" />}
              />
              <InfoItem
                label={t("department")}
                value={school.department}
                icon={<NavigationIcon className="h-4 w-4" />}
              />
              <InfoItem
                label={t("region")}
                value={school.region}
                icon={<LocateFixedIcon className="h-4 w-4" />}
              />
              <InfoItem
                label={t("city")}
                value={school.city}
                icon={<MapPinHouse className="h-4 w-4" />}
              />
              <InfoItem
                label={t("headmaster")}
                value={school.headmaster}
                icon={<UserIcon className="h-4 w-4" />}
              />
              <InfoItem
                label={t("phoneNumber")}
                value={school.phoneNumber1}
                icon={<Phone className="h-4 w-4" />}
              />
              <InfoItem
                label={t("phoneNumber")}
                value={school.phoneNumber2}
                icon={<Phone className="h-4 w-4" />}
              />
              <InfoItem
                label={t("email")}
                value={school.email}
                icon={<Mail className="h-4 w-4" />}
              />
              <InfoItem
                label={t("website")}
                value={school.website}
                icon={<Globe className="h-4 w-4" />}
              />
              <InfoItem
                label={t("address")}
                value={`${school.city ?? ""}, ${school.region ?? ""}`}
                icon={<MapPin className="h-4 w-4" />}
              />
            </div>
            {/* <div className="mt-4 text-sm text-muted-foreground">
            <p>
              {t("created_at")}: {school.createdAt.toLocaleString()}
            </p>
            <p>
              {t("last_updated")}: {school.updatedAt.toLocaleString()}
            </p>
          </div> */}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense fallback={<Skeleton className="h-20" />}>
                <DefaultSettings school={school} />
              </Suspense>
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>
    </HydrateClient>
  );
}

function InfoItem({
  label,
  value,
  icon,
  children,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  if (!value && !children) return null;
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span className="font-medium">{label}:</span>
      <span className="text-muted-foreground">{value}</span>
      {children}
    </div>
  );
}
