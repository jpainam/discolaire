import rangeMap from "@/lib/range-map";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@repo/ui/scroll-area";

export default function ImoprtPhotoResults() {
  return (
    <div className="flex flex-col">
      <h1>Import Photo Results</h1>
      <div className="flex justify-between">
        <h1>10 Photos ont été importées avec succèes</h1>
        <h1>396 Echoué</h1>
      </div>
      <div className="text-md font-bold">Détails des échecs</div>
      <ScrollArea className="h-72 w-48">
        {rangeMap(100, (i) => {
          const bg = i % 2 === 0 ? "bg-gray-100" : "bg-white";
          return (
            <div key={i} className={cn("flex flex-col", bg)}>
              StudentMatric : : impossible de trouver l'image dans l'archive
            </div>
          );
        })}
      </ScrollArea>
      <div className="text-md font-bold">Détails des succès</div>
      <ScrollArea className="h-72 w-48">
        {rangeMap(10, (i) => {
          const bg = i % 2 === 0 ? "bg-gray-100" : "bg-white";
          return (
            <div key={i} className={cn("flex flex-col", bg)}>
              StudentMatric : : impossible de trouver l'image dans l'archive
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}
