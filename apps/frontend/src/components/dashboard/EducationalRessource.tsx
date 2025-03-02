"use client";

import { cn } from "@repo/ui/lib/utils";
import { FileIcon } from "lucide-react";

import { useLocale } from "~/i18n";

interface Resource {
  subject: string;
  fileName: string;
  depositDate: string;
}

const resources: Resource[] = [
  {
    subject: "MATHÉMATIQUES",
    fileName: "3e_MATHS_01_Utiliser les nombres pour comparer, calc...",
    depositDate: "2 juin",
  },
  {
    subject: "MUSIQUE",
    fileName: "Biographie-Mozart.pdf",
    depositDate: "22 mai",
  },
  {
    subject: "MATHÉMATIQUES",
    fileName: "3e_MATHS_04_Interpréter, représenter et traiter des d...",
    depositDate: "22 mai",
  },
  {
    subject: "ANGLAIS LV1",
    fileName: "The Tales of Mother Goose - Blue Beard.pdf",
    depositDate: "25 avril",
  },
  {
    subject: "MUSIQUE",
    fileName: "Biographie-Dvorak.pdf",
    depositDate: "24 avril",
  },
];

export function EducationalRessource({ className }: { className?: string }) {
  const { t } = useLocale();
  return (
    <div className={cn("rounded-lg border", className)}>
      <div className="px-4 pt-2 text-center text-lg font-bold">
        {t("resources")}
      </div>
      <div>
        <h2 className="mx-4 mb-2 rounded-lg bg-gray-700 p-2 px-4 text-sm text-white">
          {t("latest_educational_resources")}
        </h2>
        <ul className="flex flex-col gap-4 px-4 py-4">
          {resources.map((resource, index) => (
            <li
              key={index}
              className="rounded-lg border-l-4 pl-4"
              style={{ borderColor: getSubjectColor(resource.subject) }}
            >
              <h3 className="font-bold">{resource.subject}</h3>
              <div className="mb-2 mt-1 flex cursor-pointer flex-row items-center gap-2 rounded-md bg-purple-100 p-2 text-xs text-purple-800 hover:bg-purple-700 hover:text-purple-200">
                <FileIcon className="h-4 w-4" />
                {resource.fileName}
              </div>
              <p className="text-sm text-gray-600">
                {t("")} {resource.depositDate}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
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
