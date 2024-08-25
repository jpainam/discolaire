import { getServerTranslations } from "~/app/i18n/server";
import { StudentPhotoContent } from "~/components/students/photos/photo-content";
import { PhotoHeader } from "~/components/students/photos/PhotoHeader";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col">
      <PhotoHeader />
      <StudentPhotoContent />
    </div>
  );
}
