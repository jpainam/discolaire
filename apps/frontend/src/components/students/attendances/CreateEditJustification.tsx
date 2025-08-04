/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileText, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import z from "zod";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";

import type { AttendanceRecord } from "./student-attendance-record";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const schema = z.object({});

export function CreateEditJustification({
  record,
}: {
  record: AttendanceRecord | null;
}) {
  const [justificationText, setJustificationText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { closeModal } = useModal();
  const t = useTranslations();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };
  const trpc = useTRPC();
  const createJustification = useMutation(
    trpc.attendance.justify.mutationOptions({}),
  );

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!record || !justificationText.trim()) return;

    // onSubmit(record.id, {
    //   text: justificationText.trim(),
    //   document: selectedFile || undefined,
    // });

    setJustificationText("");
    setSelectedFile(null);
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (!record) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted/50 space-y-2 rounded-lg p-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Record Details</h4>
          <Badge variant="outline">{getTypeLabel(record.type)}</Badge>
        </div>
        <div className="text-muted-foreground text-sm">
          <p>
            <strong>Date:</strong>{" "}
            {format(new Date(record.date), "MMMM dd, yyyy")}
          </p>
          <p>
            <strong>Term:</strong>{" "}
            {record.term === "first"
              ? "1st"
              : record.term === "second"
                ? "2nd"
                : "3rd"}{" "}
            Term
          </p>
          {record.type === "exclusion" && (
            <p>
              <strong>Reason:</strong> {record.details.reason}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-2">
        <h4 className="font-medium text-blue-900">Current Justification</h4>
        <p className="text-sm text-blue-800">Justification text</p>
        {record.justified > 0 && (
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <FileText className="h-4 w-4" />
            <span>Lien d document</span>
          </div>
        )}
        <p className="mt-2 text-xs text-blue-600">
          Submitted on {format(new Date(), "MMMM dd, yyyy")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="justification">Justification Text *</Label>
          <Textarea
            id="justification"
            placeholder="Explain the reason for this attendance issue..."
            value={justificationText}
            onChange={(e) => setJustificationText(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Supporting Document (Optional)</Label>
          <div className="space-y-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {selectedFile ? (
              <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{selectedFile.name}</span>
                  <span className="text-muted-foreground text-xs">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            )}

            <p className="text-muted-foreground text-xs">
              Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-2">
        <Button
          size={"sm"}
          variant="outline"
          onClick={() => {
            closeModal();
          }}
        >
          {t("close")}
        </Button>

        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!justificationText.trim()}
        >
          {record.justified > 0
            ? "Update Justification"
            : "Submit Justification"}
        </Button>
      </div>
    </div>
  );
}
