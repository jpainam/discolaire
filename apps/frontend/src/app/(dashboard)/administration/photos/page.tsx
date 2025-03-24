import { ImportPhotos } from "~/components/administration/photos/import-photos";
import { PhotosList } from "~/components/administration/photos/PhotosList";

export default function PictureMangement() {
  return (
    <div className="flex w-full flex-col px-4 gap-2 py-2">
      <PhotosList />

      <ImportPhotos />
    </div>
  );
}
