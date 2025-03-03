export default async function Page(props: {
  searchParams: Promise<{ category: string }>;
}) {
  const searchParams = await props.searchParams;
  console.log(searchParams.category);
  return <div>Vie scolaire page {searchParams.category}</div>;
}
