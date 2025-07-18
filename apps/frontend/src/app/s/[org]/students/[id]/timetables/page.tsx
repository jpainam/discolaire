import { ClientContainer } from "~/components/calendar/client-container";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode: "day" | "week" | "month" | null | undefined }>;
}) {
  const searchParams = await props.searchParams;
  console.log(searchParams);
  // const mode = searchParams.mode ?? "week";
  return <ClientContainer />;
}
