"use client";
import { useParams } from "next/navigation";

export function StudentRightbar() {
  const params = useParams() as { id: string };
  if (!params.id) {
    return null;
  }

  return (
    <div className="grid md:flex flex-col gap-2 md:w-[200px] lg:w-[250px] text-sm">
      Montrer des courbe de l'activites recente, comme derniere connection. ou
      derniere activites comme modification du profile
      <div className="flex flex-col ml-4">
        <span className="italic">Last sign in: 2024-20-20 at 15h:20min</span>
      </div>
    </div>
  );
}
