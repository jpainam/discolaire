export default async function Page(props: {
  searchParams: Promise<{
    classroom: string;
    from: string;
    status: string;
    to: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  console.log(searchParams);
  //const transactions = await api.transaction.required({});
  return <div>En cours d'implementation</div>;
}
