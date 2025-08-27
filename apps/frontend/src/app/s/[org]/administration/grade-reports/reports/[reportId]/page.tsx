export default async function Page(props: {
  params: Promise<{ reportId: string }>;
}) {
  const params = await props.params;
  return (
    <div className="bg-background flex-1 rounded-md border p-4">
      Report for this id {params.reportId}
    </div>
  );
}
