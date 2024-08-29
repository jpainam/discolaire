export default function Page({
  params: { id, appreciationId },
}: {
  params: { id: string; appreciationId: string };
}) {
  return (
    <div>
      {id} - {appreciationId}
    </div>
  );
}
