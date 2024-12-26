import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth";

import { SchoolContextProvider } from "~/contexts/SchoolContext";
import { Footer } from "~/layouts/Footer";
import GlobalModal from "~/layouts/GlobalModal";
import GlobalSheet from "~/layouts/GlobalSheet";
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
  const schoolYearId = (await cookies()).get("schoolYear")?.value;
  if (!schoolYearId) {
    throw new Error("No school year selected");
  }

  const schoolYear = await api.schoolYear.get(schoolYearId);
  const permissions = await api.user.permissions();
  return (
    <SchoolContextProvider
      schoolYear={schoolYear}
      school={school}
      permissions={permissions}
    >
      {/* <NoticeBanner /> */}
      <Header />
      <main className="min-h-screen flex-1">{children}</main>
      <GlobalSheet />
      <GlobalModal />
      <Footer />
    </SchoolContextProvider>
  );
}
