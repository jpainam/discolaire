export default async function Page(props: {
  searchParams: Promise<{ cat?: "students" | "staffs" | "parents" }>;
}) {
  const searchParams = await props.searchParams;

  const { cat } = searchParams;

  return <div>{cat}</div>;
}
