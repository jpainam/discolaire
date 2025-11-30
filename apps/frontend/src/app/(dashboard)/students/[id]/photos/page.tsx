import { getTranslations } from "next-intl/server";

import { downloadFileFromAws } from "~/actions/upload";
import { EmptyComponent } from "~/components/EmptyComponent";
import { PhotoHeader } from "~/components/students/photos/PhotoHeader";
import { StudentPhotoList } from "~/components/students/photos/StudentPhotoList";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await caller.student.get(params.id);
  const photos = await Promise.all(
    student.photos.map(async (photo) => {
      const signedUrl = await downloadFileFromAws(photo);
      return signedUrl;
    }),
  );
  const t = await getTranslations();
  return (
    <div className="flex flex-col">
      <PhotoHeader />
      {photos.length === 0 ? (
        <EmptyComponent title={t("no_data")} />
      ) : (
        <StudentPhotoList photos={photos} />
      )}
    </div>
  );
}
