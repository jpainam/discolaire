import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { PhotosList } from "./PhotosList";
import { ZipImageMatcher } from "./ZipImageMatcher";

export default async function Page() {
  const t = await getTranslations();
  return (
    <div className="grid flex-col gap-2 px-4 py-2 md:flex">
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("administration"), href: "/administration" },
          { label: t("photos"), href: "/administration/photos" },
        ]}
      />
      <PhotosList />
      <ZipImageMatcher />
      {/* <ImportPhotos /> */}
    </div>
  );
}
