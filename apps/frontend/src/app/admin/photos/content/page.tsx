export default function Page({
  searchParams: { cat },
}: {
  searchParams: { cat?: "students" | "staffs" | "parents" };
}) {
  return <div>{cat}</div>;
}
