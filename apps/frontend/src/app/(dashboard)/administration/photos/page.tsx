import { PhotosList } from "~/app/(dashboard)/administration/photos/PhotosList";
import { ZipImageMatcher } from "./ZipImageMatcher";

export default function Page() {
  return (
    <div className="grid md:flex flex-col px-4 gap-2 py-2">
      <PhotosList />
      <ZipImageMatcher />
      {/* <ImportPhotos /> */}
    </div>
  );
}
