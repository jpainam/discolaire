"use client";

import { BugIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  FloatingPanelBody,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelForm,
  FloatingPanelLabel,
  FloatingPanelRoot,
  FloatingPanelSubmitButton,
  FloatingPanelTextarea,
  FloatingPanelTrigger,
} from "~/components/floating-panel";

export function ReportFalseGrade() {
  const handleSubmit = (note: string) => {
    console.log("Submitted note:", note);
  };

  const t = useTranslations();

  return (
    <FloatingPanelRoot>
      <FloatingPanelTrigger
        title="Add Note"
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex flex-row items-center space-x-2 rounded-md px-4 py-2 transition-colors"
      >
        <div className="flex flex-row items-center gap-2">
          <BugIcon className="size-4" />
          {t("report_false_grade")}
        </div>
      </FloatingPanelTrigger>
      <FloatingPanelContent className="w-80">
        <FloatingPanelForm onSubmit={handleSubmit}>
          <FloatingPanelBody>
            <FloatingPanelLabel htmlFor="note-input">
              {t("details")}
            </FloatingPanelLabel>
            <FloatingPanelTextarea id="note-input" className="min-h-[100px]" />
          </FloatingPanelBody>
          <FloatingPanelFooter>
            <FloatingPanelCloseButton />
            <FloatingPanelSubmitButton />
          </FloatingPanelFooter>
        </FloatingPanelForm>
      </FloatingPanelContent>
    </FloatingPanelRoot>
  );
}
