import { PhotosList } from "./PhotosList";
import { ZipImageMatcher } from "./ZipImageMatcher";

export default function Page() {
  return (
    <div className="grid flex-col gap-2 px-4 py-2 md:flex">
      <PhotosList />
      <ZipImageMatcher />
      {/* <ImportPhotos /> */}
    </div>
  );
}
