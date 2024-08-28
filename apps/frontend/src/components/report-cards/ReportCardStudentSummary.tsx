"use client";

import { DirectionAwareTabs } from "@repo/ui/direction-aware-tabs";

const ReportCardStudentSummary = () => {
  const tabs = [
    {
      id: 0,
      label: "ocean",
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-border/50 p-4">
          content of div1
        </div>
      ),
    },
    {
      id: 1,
      label: "forest",
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-border/50 p-4">
          content of div 1
        </div>
      ),
    },
    {
      id: 2,
      label: "default",
      content: (
        <div className="flex w-full flex-col items-center gap-3 border border-border/50 p-4">
          content of div2
        </div>
      ),
    },
    {
      id: 3,
      label: "sunset",
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-border/50 p-4">
          Content of div 3
        </div>
      ),
    },
  ];

  return (
    <div className="m-4 items-start justify-start bg-red-500">
      <DirectionAwareTabs tabs={tabs} />
    </div>
  );
};

export { ReportCardStudentSummary };
