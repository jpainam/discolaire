import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  //const { t } = await getServerTranslations();
  return <div className="min-h-[60vh]">{children}</div>;
}
