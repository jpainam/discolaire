import { StudentPhotoContent } from "~/components/students/photos/photo-content";
import { PhotoHeader } from "~/components/students/photos/PhotoHeader";

export default function Page() {
  return (
    <div className="flex flex-col">
      <PhotoHeader />
      <StudentPhotoContent />
    </div>
  );
}
