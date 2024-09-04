import { redirect } from "next/navigation";

import { auth } from "@repo/auth";

import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  return (
    <>
      {/* <NoticeBanner /> */}
      <Header />

      <main className="min-h-[80vh] flex-1">{children}</main>
      <Footer />
    </>
  );
}
