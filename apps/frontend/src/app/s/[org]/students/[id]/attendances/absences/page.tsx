import { EmptyState } from "~/components/EmptyState";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = await props.params;
  return <EmptyState className="py-8" />;
}
