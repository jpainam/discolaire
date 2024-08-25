import { NoticeBanner } from "@repo/ui/Banner";

import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NoticeBanner />
      <Header />

      <main className="min-h-[80vh] flex-1">{children}</main>
      <Footer />
    </>
  );
}
