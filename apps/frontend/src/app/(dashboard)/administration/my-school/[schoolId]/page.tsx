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
import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import FlatBadge from "~/components/FlatBadge";
import { NoPermission } from "~/components/no-permission";
import { getServerTranslations } from "~/i18n/server";

import { env } from "~/env";
import { api } from "~/trpc/server";
import { DefaultSettings } from "./DefaultSettings";
import { SchoolDetailAction } from "./SchoolDetailAction";

export default async function Page(props: {
  params: Promise<{ schoolId: string }>;
}) {
  const params = await props.params;

  const { schoolId } = params;

  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }

  const school = await api.school.get(schoolId);

  if (
    school.id !== session.user.schoolId &&
    session.user.username !== env.SUPER_ADMIN_USERNAME
  ) {
    return <NoPermission />;
  }

  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2 text-sm">
      <Card className="p-0">
        <CardHeader className="flex flex-row items-center space-x-4 border-b bg-muted/50 p-2">
          {school.logo && (
            <Image
              src={`/api/download/images/${school.logo}`}
              alt={school.name}
              width={80}
              height={80}
            />
          )}

          <div className="flex-1">
            <CardTitle className="text-xl">{school.name}</CardTitle>
            <p className="text-sm text-muted-foreground">ID: {school.id}</p>
          </div>
          <FlatBadge variant={school.isActive ? "green" : "red"}>
            {school.isActive ? t("active") : t("inactive")}
          </FlatBadge>
          <SchoolDetailAction schoolId={schoolId} />
        </CardHeader>
        <CardContent className="p-2">
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
      <Card className="p-0">
        <CardHeader className="border-b bg-muted/50 p-2">
          <CardTitle>{t("default_settings")}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <DefaultSettings school={school} />
        </CardContent>
      </Card>
    </div>
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
