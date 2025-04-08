export default async function Page(props: {
  params: Promise<{ category: string }>;
}) {
  const params = await props.params;

  return <div>{params.category}</div>;
}
