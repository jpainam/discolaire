"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import i18next from "i18next";
import { DownloadIcon, FileIcon, RatioIcon } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { DatePicker } from "../DatePicker";
import { EmptyComponent } from "../EmptyComponent";

export function EducationalResource({ className }: { className?: string }) {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: resources } = useQuery(trpc.document.latest.queryOptions({}));
  // const colors = [
  //   "bg-red-500",
  //   "bg-green-500",
  //   "bg-blue-500",
  //   "bg-yellow-500",
  //   "bg-purple-500",
  // ];

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RatioIcon className="h-4 w-4" />
          {t("resources")}
        </CardTitle>
        <CardDescription className="text-xs">
          {t("latest_educational_resources")}
        </CardDescription>
        <CardAction>
          <DatePicker
            defaultValue={undefined}
            onSelectAction={(e) => {
              console.log(e);
            }}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        {resources?.length === 0 && <EmptyComponent title={t("no_data")} />}
        {resources?.slice(0, 5).map((resource, index) => (
          <div
            key={index}
            className="group hover:bg-muted/50 relative flex items-center justify-between space-x-4 border pr-2 transition-colors"
          >
            <div className="border-l-4 p-4 py-2" style={{ borderColor: "red" }}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge className="font-medium" variant={"outline"}>
                    {resource.title}
                  </Badge>
                  <time className="text-muted-foreground text-sm">
                    {format(resource.createdAt, "d MMMM", {
                      locale:
                        i18next.language == "fr"
                          ? fr
                          : i18next.language == "es"
                            ? es
                            : enUS,
                    })}
                  </time>
                </div>
                <div className="group-hover:text-primary mt-1 leading-none tracking-tight">
                  <div className="flex items-center gap-2 text-xs">
                    <FileIcon className="text-muted-foreground h-4 w-4" />
                    <Link href={"#"} target="_blank" className="truncate">
                      {resource.attachments.length > 0
                        ? resource.attachments[0]
                        : ""}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 transition-opacity group-hover:opacity-100"
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
