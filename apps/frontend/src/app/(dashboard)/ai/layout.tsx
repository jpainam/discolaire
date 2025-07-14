import { redirect } from "next/navigation";
import Script from "next/script";
import { getSession } from "~/auth/server";
import { DataStreamProvider } from "~/components/ai/data-stream-provider";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>{children}</DataStreamProvider>
    </>
  );
}
