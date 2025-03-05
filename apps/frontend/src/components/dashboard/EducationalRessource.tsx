"use client";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { DownloadIcon, FileIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import i18next from "i18next";
import Link from "next/link";
import { useLocale } from "~/i18n";
import { DatePicker } from "../DatePicker";

interface Resource {
  subject: string;
  fileName: string;
  depositDate: string;
}

const resources: Resource[] = [
  {
    subject: "MATHÉMATIQUES",
    fileName: "3e_MATHS_01_Utiliser les nombres pour comparer, calc...",
    depositDate: "05/06/2022",
  },
  {
    subject: "MUSIQUE",
    fileName: "Biographie-Mozart.pdf",
    depositDate: "05/22/2022",
  },
  {
    subject: "MATHÉMATIQUES",
    fileName: "3e_MATHS_04_Interpréter, représenter et traiter des d...",
    depositDate: "05/06/2022",
  },
  {
    subject: "ANGLAIS LV1",
    fileName: "The Tales of Mother Goose - Blue Beard.pdf",
    depositDate: "04/25/2022",
  },
  {
    subject: "MUSIQUE",
    fileName: "Biographie-Dvorak.pdf",
    depositDate: "04/24/2022",
  },
];

export function EducationalRessource({ className }: { className?: string }) {
  const { t } = useLocale();

  return (
    <Card className={cn("rounded-lg border p-0 gap-0", className)}>
      <CardHeader className="p-4 border-b justify-between  flex flex-row items-center">
        <div className="flex flex-col gap-2 ">
          <CardTitle>{t("resources")}</CardTitle>
          <CardDescription>{t("latest_educational_resources")}</CardDescription>
        </div>
        <div>
          <DatePicker
            defaultValue={new Date()}
            onChange={(e) => {
              console.log(e);
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-2 ">
        <div className="space-y-4">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="group relative flex justify-between pr-2 items-center space-x-4 border hover:bg-muted/50 transition-colors"
            >
              <div
                className="border-l-4 py-2  p-4"
                style={{ borderColor: getSubjectColor(resource.subject) }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge className="font-medium" variant={"outline"}>
                      {resource.subject}
                    </Badge>
                    <time className="text-sm text-muted-foreground">
                      {format(resource.depositDate, "d MMMM", {
                        locale:
                          i18next.language == "fr"
                            ? fr
                            : i18next.language == "es"
                              ? es
                              : enUS,
                      })}
                    </time>
                  </div>
                  <div className="mt-1 leading-none tracking-tight group-hover:text-primary">
                    <div className="flex text-xs items-center gap-2">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                      <Link href={"#"} target="_blank" className="truncate">
                        {resource.fileName}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getSubjectColor(subject: string): string {
  switch (subject) {
    case "MATHÉMATIQUES":
      return "#FF6B6B";
    case "MUSIQUE":
      return "#4ECDC4";
    case "ANGLAIS LV1":
      return "#45B7D1";
    default:
      return "#95A5A6";
  }
}
