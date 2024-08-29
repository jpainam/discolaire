"use client";

import { useParams } from "next/navigation";

export function StudentRightbar() {
  const params = useParams();
  if (!params.id) {
    return null;
  }

  return (
    <div className="grid flex-col gap-2 text-sm md:flex md:w-[200px] lg:w-[250px]">
      Montrer des courbe de l'activites recente, comme derniere connection. ou
      derniere activites comme modification du profile
      <div className="ml-4 flex flex-col">
        <span className="italic">Last sign in: 2024-20-20 at 15h:20min</span>
      </div>
    </div>
  );
}
