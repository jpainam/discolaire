import { notFound, redirect } from "next/navigation";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

import { auth } from "@repo/auth";
import { getServerTranslations } from "@repo/i18n/server";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import FlatBadge from "@repo/ui/FlatBadge";
import { NoPermission } from "@repo/ui/no-permission";

import { env } from "~/env";
import { api } from "~/trpc/server";
import { SchoolDetailAction } from "./SchoolDetailAction";

export default async function Page({
  params: { schoolId },
}: {
  params: { schoolId: string };
}) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }

  const school = await api.school.get(schoolId);
  if (!school) {
    notFound();
  }
  if (
    school.id !== session.user.schoolId &&
    session.user.username !== env.SUPER_ADMIN_USERNAME
  ) {
    return <NoPermission />;
  }
  const { t } = await getServerTranslations();
  return (
    <div className="m-8">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 border-b bg-muted/50 p-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={school.logo ?? ""} alt={school.name} />
            <AvatarFallback>
              {school.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl">{school.name}</CardTitle>
            <p className="text-sm text-muted-foreground">ID: {school.id}</p>
          </div>
          <FlatBadge variant={school.isActive ? "green" : "red"}>
            {school.isActive ? t("active") : t("inactive")}
          </FlatBadge>
          <SchoolDetailAction schoolId={school.id} />
        </CardHeader>
        <CardContent className="py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoItem label={t("authorization")} value={school.authorization} />
            <InfoItem label={t("ministry")} value={school.ministry} />
            <InfoItem label={t("department")} value={school.department} />
            <InfoItem label={t("region")} value={school.region} />
            <InfoItem label={t("city")} value={school.city} />
            <InfoItem label={t("headmaster")} value={school.headmaster} />
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
              label={t("location")}
              value={`${school.city ?? ""}, ${school.region ?? ""}`}
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              {t("created_at")}: {school.createdAt.toLocaleString()}
            </p>
            <p>
              {t("last_updated")}: {school.updatedAt.toLocaleString()}
            </p>
          </div>
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
