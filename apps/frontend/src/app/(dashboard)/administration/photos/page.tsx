import { ImportPhotos } from "@/components/administration/photos/import-photos";
import { PhotosList } from "@/components/administration/photos/photos-list";

type PictureCategory = "student" | "staff";

type PictureMangementProps = {
  searchParams: { id?: string; cat?: PictureCategory };
};
export default function PictureMangement({
  searchParams: { id, cat },
}: PictureMangementProps) {
  return (
    <div className="flex flex-col w-full gap-2 py-2">
      <PhotosList />

      <ImportPhotos />
    </div>
  );
}
