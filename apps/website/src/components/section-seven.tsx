"use client";

import { TypewriterEffectSmooth } from "~/components/ui/typewriter-effect";

export function SectionSeven() {
  const words = [
    {
      text: "Simplifiez ",
    },
    {
      text: "la gestion",
    },
    {
      text: "de votre",
    },
    {
      text: "école.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-xs text-neutral-600 sm:text-base dark:text-neutral-200">
        Le chemin vers la réussite commence ici
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4">
        <button className="h-10 w-40 rounded-xl border border-transparent bg-black text-sm text-white dark:border-white">
          Nous contacter
        </button>
        <button className="h-10 w-40 rounded-xl border border-black bg-white text-sm text-black">
          Plateforme démo
        </button>
      </div>
    </div>
  );
}
