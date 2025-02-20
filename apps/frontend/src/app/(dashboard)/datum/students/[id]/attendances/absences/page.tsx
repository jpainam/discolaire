import { EmptyState } from "@repo/ui/components/EmptyState";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  console.log(params);
  return <EmptyState className="py-8" />;
}
