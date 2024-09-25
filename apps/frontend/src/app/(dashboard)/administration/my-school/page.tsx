import { notFound } from "next/navigation";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

import { auth } from "@repo/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

import { api } from "~/trpc/server";
import { PageHeader } from "../PageHeader";

export default async function Page() {
  const session = await auth();
  const schoolId = session?.user.schoolId;
  const school = await api.school.get(schoolId ?? "IPW");
  if (!school) {
    notFound();
  }
  return (
    <div className="flex flex-col">
      <PageHeader title="My School" />
      <div className="container mx-auto py-10">
        <Card className="mx-auto w-full max-w-3xl">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={school.logo ?? ""} alt={school.name} />
              <AvatarFallback>
                {school.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{school.name}</CardTitle>
              <p className="text-sm text-muted-foreground">ID: {school.id}</p>
            </div>
            <Badge variant={school.isActive ? "default" : "secondary"}>
              {school.isActive ? "Active" : "Inactive"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem label="Authorization" value={school.authorization} />
              <InfoItem label="Ministry" value={school.ministry} />
              <InfoItem label="Department" value={school.department} />
              <InfoItem label="Region" value={school.region} />
              <InfoItem label="City" value={school.city} />
              <InfoItem label="Headmaster" value={school.headmaster} />
              <InfoItem
                label="Phone 1"
                value={school.phoneNumber1}
                icon={<Phone className="h-4 w-4" />}
              />
              <InfoItem
                label="Phone 2"
                value={school.phoneNumber2}
                icon={<Phone className="h-4 w-4" />}
              />
              <InfoItem
                label="Email"
                value={school.email}
                icon={<Mail className="h-4 w-4" />}
              />
              <InfoItem
                label="Website"
                value={school.website}
                icon={<Globe className="h-4 w-4" />}
              />
              <InfoItem
                label="Location"
                value={`${school.city ?? ""}, ${school.region ?? ""}`}
                icon={<MapPin className="h-4 w-4" />}
              />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Created: {school.createdAt.toLocaleString()}</p>
              <p>Last Updated: {school.updatedAt.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
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
