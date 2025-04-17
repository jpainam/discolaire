"use client";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { DownloadIcon, FileIcon, RatioIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import Link from "next/link";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { DatePicker } from "../DatePicker";
import { EmptyState } from "../EmptyState";

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
          <RatioIcon className="w-4 h-4" />
          {t("resources")}
        </CardTitle>
        <CardDescription className="text-xs">
          {t("latest_educational_resources")}
        </CardDescription>
        <CardAction>
          <DatePicker
            defaultValue={new Date()}
            onChange={(e) => {
              console.log(e);
            }}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        {resources?.length === 0 && (
          <EmptyState className="my-8" title={t("no_data")} />
        )}
        {resources?.slice(0, 5).map((resource, index) => (
          <div
            key={index}
            className="group relative flex justify-between pr-2 items-center space-x-4 border hover:bg-muted/50 transition-colors"
          >
            <div
              className="border-l-4 py-2  p-4"
              style={{ borderColor: "red" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge className="font-medium" variant={"outline"}>
                    {resource.title}
                  </Badge>
                  <time className="text-sm text-muted-foreground">
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
                <div className="mt-1 leading-none tracking-tight group-hover:text-primary">
                  <div className="flex text-xs items-center gap-2">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
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
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
