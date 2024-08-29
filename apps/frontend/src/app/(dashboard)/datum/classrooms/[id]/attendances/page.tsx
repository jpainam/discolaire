export default function Page({
  params: { id },
  searchParams: { type, date },
}: {
  params: { id: string };
  searchParams: { type?: string; date?: Date };
}) {
  return (
    <div className="mb-2 flex flex-1 flex-col">
      {id} - {type} - {JSON.stringify(date)}
    </div>
  );
}
