"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Upload,
} from "lucide-react";

import type { Document } from "./parent-data";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface DocumentsCardProps {
  documents: Document[];
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    color: "bg-warning/10 text-warning border-warning/20",
  },
  approved: {
    icon: CheckCircle,
    label: "Approved",
    color: "bg-success/10 text-success border-success/20",
  },
  expired: {
    icon: AlertCircle,
    label: "Expired",
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const typeIcons: Record<string, string> = {
  identification: "ID",
  address: "ADDR",
  authorization: "AUTH",
  medical: "MED",
};

export function DocumentsCard({ documents }: DocumentsCardProps) {
  const expiredCount = documents.filter((d) => d.status === "expired").length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="text-primary h-5 w-5" />
            Documents
          </CardTitle>
          {expiredCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              {expiredCount} Expired
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => {
            const status = statusConfig[doc.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={doc.id}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                  doc.status === "expired"
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border hover:bg-secondary/30"
                }`}
              >
                <div className="bg-secondary text-muted-foreground flex h-12 w-12 items-center justify-center rounded-lg p-2 text-xs font-bold">
                  {typeIcons[doc.type] || "DOC"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">
                    {doc.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Uploaded:{" "}
                    {new Date(doc.uploadedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`gap-1 text-xs ${status.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>

                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="outline" className="mt-4 w-full gap-2 bg-transparent">
          <Upload className="h-4 w-4" />
          Upload New Document
        </Button>
      </CardContent>
    </Card>
  );
}
