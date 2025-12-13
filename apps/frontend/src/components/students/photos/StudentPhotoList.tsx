import { ScrollArea } from "~/components/ui/scroll-area";
import { StudentPhotoCard } from "./StudentPhotoCard";

export function StudentPhotoList({ photos }: { photos: string[] }) {
  return (
    <div className="flex flex-col p-4">
      <ScrollArea>
        <div className="grid grid-cols-1 gap-4 space-x-4 pb-4 md:grid-cols-4">
          {photos.map((photo, index) => (
            <StudentPhotoCard
              key={index}
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
