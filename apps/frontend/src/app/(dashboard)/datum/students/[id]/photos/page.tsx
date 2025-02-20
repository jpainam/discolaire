import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/components/EmptyState";

import { downloadFileFromAws } from "~/actions/upload";
import { PhotoHeader } from "~/components/students/photos/PhotoHeader";
import { StudentPhotoList } from "~/components/students/photos/StudentPhotoList";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await api.student.get(params.id);
  const photos = await Promise.all(
    student.photos.map(async (photo) => {
      const signedUrl = await downloadFileFromAws(photo);
      return signedUrl;
    }),
  );
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col">
      <PhotoHeader />
      {photos.length === 0 ? (
        <EmptyState className="my-8" title={t("no_data")} />
      ) : (
        <StudentPhotoList photos={photos} />
      )}
    </div>
  );
}
