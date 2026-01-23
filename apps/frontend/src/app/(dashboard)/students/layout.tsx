import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";

export default async function Layout(props: PropsWithChildren) {
  const t = await getTranslations();
  return (
    <ErrorBoundary errorComponent={ErrorFallback}>
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/", },
          { label: t("students"), href: "/students" },
        ]}
      />
      {props.children}
    </ErrorBoundary>
  );
}
