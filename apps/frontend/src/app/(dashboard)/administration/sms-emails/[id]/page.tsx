export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  return <div>Details of bulk SMS send with id {id}</div>;
}
