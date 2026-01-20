export default async function Page(props: { params: Promise<{ id: string }> }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = await props.params;
  return (
    <div className="p-4">{/* <PermissionTable userId={params.id} /> */}</div>
  );
}
