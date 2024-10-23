import { ImportPhotos } from "~/components/administration/photos/import-photos";
import { PhotosList } from "~/components/administration/photos/photos-list";

// type PictureCategory = "student" | "staff";

// interface PictureMangementProps {
//   searchParams: { id?: string; cat?: PictureCategory };
// }
export default function PictureMangement() {
  return (
    <div className="flex w-full flex-col gap-2 py-2">
      <PhotosList />

      <ImportPhotos />
    </div>
  );
}
