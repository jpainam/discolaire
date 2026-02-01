"use client";

import { useMemo } from "react";

import type { RouterOutputs } from "@repo/api";

import type { DocumentDisplayType } from "./documentTypeStyles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { getColor, iconMap } from "./documentTypeStyles";

const getSize = (size: number) => {
  if (size >= 1024 ** 3) {
    return `${(size / 1024 ** 3).toFixed(1)} GB`;
  }
  if (size >= 1024 ** 2) {
    return `${(size / 1024 ** 2).toFixed(1)} MB`;
  }
  return `${Math.round(size / 1024)} KB`;
};
export function DocumentStorageCard({
  stats,
}: {
  stats?: RouterOutputs["document"]["stats"];
}) {
  const breakdown = useMemo(() => {
    return [
      {
        type: "images",
        size: stats?.image.size ?? 0,
        color: getColor("images"),
      },
      {
        type: "videos",
        size: stats?.video.size ?? 0,
        color: getColor("videos"),
      },
      {
        type: "documents",
        size: stats?.document.size ?? 0,
        color: getColor("documents"),
      },
      {
        type: "archives",
        size: stats?.archived.size ?? 0,
        color: getColor("archives"),
      },
      {
        type: "others",
        size: stats?.other.size ?? 0,
        color: getColor("others"),
      },
    ];
  }, [stats]);
  const totalSize = stats?.totalSize ?? 0;
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {breakdown.map((item) => {
        const Icon = iconMap[item.type as DocumentDisplayType];
        const percentage =
          totalSize > 0 ? ((item.size / totalSize) * 100).toFixed(0) : 0;

        return (
          <Card key={item.type}>
            <CardHeader>
              <CardTitle
                className="flex size-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Icon className="size-4" style={{ color: item.color }} />
              </CardTitle>
              <CardDescription className="text-background-foreground font-medium capitalize">
                {item.type}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">
                  {getSize(item.size)}
                </span>
                <span className="text-muted-foreground text-xs">
                  {percentage}%
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
