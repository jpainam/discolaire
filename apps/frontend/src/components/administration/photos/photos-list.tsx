import { routes } from "@/configs/routes";
import { PhotoListItem } from "./photo-list-item";

export function PhotosList() {
  return (
    <div className="grid grid-flow-col gap-4">
      <PhotoListItem
        href={`${routes.administration.photos.content}/?cat=students`}
        title="Photos des élèves"
        size={"2.4 GB"}
        totalFiles={135}
      />

      <PhotoListItem
        title="Photos du personnels"
        size={"1.8 GB"}
        totalFiles={15}
        href={`${routes.administration.photos.content}/?cat=staffs`}
      />

      <PhotoListItem
        title="Photos des parents"
        href={`${routes.administration.photos.content}/?cat=parents`}
        size={"528 MB"}
        totalFiles={800}
      />
    </div>
  );
}
