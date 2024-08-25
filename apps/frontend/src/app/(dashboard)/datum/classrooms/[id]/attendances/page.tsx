export default function Page({
  params: { id },
  searchParams: { type, date },
}: {
  params: { id: string };
  searchParams: { type?: string; date?: Date };
}) {
  return <div className="flex flex-col  flex-1 mb-2">Content</div>;
}
