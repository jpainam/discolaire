import { ClientContainer } from "~/components/calendar/client-container";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode: "day" | "week" | "month" | null | undefined }>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = await props.searchParams;
  // const mode = searchParams.mode ?? "week";
  return <ClientContainer />;
}
