/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { Archive, File, FileText, Image, Video } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { storageData } from "./mock-data";

const iconMap = {
  Images: Image,
  Videos: Video,
  Documents: FileText,
  Archives: Archive,
  Other: File,
};

export function DocumentStorageCard() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {storageData.breakdown.map((item) => {
        const Icon = iconMap[item.type as keyof typeof iconMap] || File;
        const percentage = ((item.size / storageData.total) * 100).toFixed(0);

        return (
          <Card key={item.type}>
            <CardHeader>
              <CardTitle
                className="flex size-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Icon className="size-4" style={{ color: item.color }} />
              </CardTitle>
              <CardDescription className="text-background-foreground font-medium">
                {item.type}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">
                  {item.size} GB
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
