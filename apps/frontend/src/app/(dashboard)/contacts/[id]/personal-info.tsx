"use client";

import {
  Briefcase,
  Building2,
  Calendar,
  CreditCard,
  Globe,
  User,
} from "lucide-react";

import type { ParentContact } from "./parent-data";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface PersonalInfoProps {
  parent: ParentContact;
}

export function PersonalInfo({ parent }: PersonalInfoProps) {
  const infoItems = [
    {
      icon: User,
      label: "Full Name",
      value: `${parent.firstName} ${parent.lastName}`,
    },
    {
      icon: Calendar,
      label: "Date of Birth",
      value: new Date(parent.dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    {
      icon: User,
      label: "Gender",
      value: parent.gender,
    },
    {
      icon: Globe,
      label: "Preferred Language",
      value: parent.language,
    },
    {
      icon: CreditCard,
      label: "National ID",
      value: parent.nationalId,
    },
    {
      icon: Briefcase,
      label: "Profession",
      value: parent.profession,
    },
    {
      icon: Building2,
      label: "Employer",
      value: parent.employer,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="text-primary h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="border-border flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
            >
              <item.icon className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-sm">{item.label}</p>
                <p className="text-foreground truncate font-medium">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
          <div className="border-border border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Account Created
              </span>
              <Badge variant="secondary">
                {new Date(parent.accountCreated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
