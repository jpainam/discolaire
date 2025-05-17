export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  console.log("params", params.id);
  return (
    <div>
      Pour chaque element, les info sur le propriete ou les different usage
    </div>
  );
}
