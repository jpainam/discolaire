import type { PropsWithChildren } from "react";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";

export default async function Layout(props: PropsWithChildren) {
  const t = await getTranslations();
  return (
    <>
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: "Communications", href: "/communications" },
        ]}
      />
      {props.children}
    </>
  );
}
