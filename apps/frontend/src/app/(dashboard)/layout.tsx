import { redirect } from "next/navigation";

import { auth } from "@repo/auth";

import { SchoolContextProvider } from "~/contexts/SchoolContext";
import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";
import { api } from "~/trpc/server";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const school = await api.school.get(session.user.schoolId);
  if (!school) {
    throw new Error("School not found");
  }
  return (
    <SchoolContextProvider school={school}>
      {/* <NoticeBanner /> */}
      <Header />

      <main className="min-h-screen flex-1">{children}</main>
      <Footer />
    </SchoolContextProvider>
  );
}
