import { studentPhotos } from "@/types/photo";
import { ScrollArea } from "@repo/ui/scroll-area";

import { PhotoCard } from "./photos-card";

export function StudentPhotoContent() {
  return (
    <div className="flex flex-col p-4">
      <ScrollArea>
        <div className="grid grid-cols-1 gap-4 space-x-4 pb-4 md:grid-cols-4">
          {studentPhotos.map((photo) => (
            <PhotoCard
              key={photo.name}
              photo={photo}
              className="w-[250px]"
              aspectRatio="portrait"
              width={250}
              height={330}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
