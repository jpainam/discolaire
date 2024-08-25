"use client";

import { routes } from "@/configs/routes";
import { useCreateQueryString } from "@/hooks/create-query-string";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function AlphabetSearchBlock() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const searchParams = useSearchParams();
  const { createQueryString } = useCreateQueryString();

  const letter = searchParams.get("letter") || "";
  const alphabetArray = alphabet.split("");
  const selection = searchParams.get("selection") || "";
  const classroom = searchParams.get("classroom") || "";
  const createUrl = useCallback(
    (name: string, value: string) => {
      return routes.datum.index + "/?" + createQueryString({ [name]: value });
    },
    [createQueryString],
  );

  return (
    <>
      <div className="flex border text-sm gap-2  border-primary border-10 p-2 rounded-lg flex-col">
        {/*<DocumentMagnifyingGlassIcon className="w-6 text-blue-dark" />*/}

        <div className="flex flex-wrap gap-1 ">
          {alphabetArray.map((value) => {
            const isActive = value === letter;
            return (
              <Link
                key={value}
                href={createUrl("letter", value)}
                className={cn(
                  "px-1 ",
                  isActive
                    ? "text-blue-750 border border-gray-50 font-bold underline"
                    : "text-blue-500",
                )}
              >
                {value}
              </Link>
            );
          })}

          {classeOptions.map(({ label, value }) => {
            const isActive = classroom === value;
            return (
              <Link
                key={value}
                href={createUrl("classroom", value)}
                className={cn(
                  "px-1.5 ",
                  isActive
                    ? "text-blue-750 border border-gray-50 font-bold underline"
                    : "text-blue-500",
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <div className="p-x-2 inline-flex flex-wrap gap-4">
          <Link
            className={cn(
              "px-1.5 ",
              selection == "saved"
                ? "text-blue-750 border border-gray-50 font-bold underline"
                : "text-blue-500",
            )}
            href={createUrl("selection", "saved")}
          >
            Résultat enregistrés
          </Link>
          <Link
            className={cn(
              "px-1.5 ",
              selection == "past"
                ? "text-blue-750 border border-gray-50 font-bold underline"
                : "text-blue-500",
            )}
            href={createUrl("selection", "past")}
          >
            Recherche précèdentes
          </Link>
          <Link
            className={cn(
              "px-1.5 ",
              selection == "advanced"
                ? "text-blue-750 border border-gray-50 font-bold underline"
                : "text-blue-500",
            )}
            href={createUrl("selection", "advanced")}
          >
            Recherche avancées
          </Link>
          <Link
            className={cn(
              "px-1.5 ",
              selection == "multiple"
                ? "text-blue-750 border border-gray-50 font-bold underline"
                : "text-blue-500",
            )}
            href={createUrl("selection", "multiple")}
          >
            Sélections multiples
          </Link>
        </div>
      </div>
    </>
  );
}

type ClasseOption = {
  label: string;
  value: string;
};
const classeOptions: ClasseOption[] = [
  { label: "Toutes", value: "all" },
  { label: "6ème", value: "6" },
  { label: "5ème", value: "5" },
  { label: "4ème", value: "4" },
  { label: "3ème", value: "3" },
  { label: "2nd", value: "2" },
  { label: "1ère", value: "1" },
  { label: "Tle", value: "T" },
];
