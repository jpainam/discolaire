import { AttendanceHeader } from "~/components/students/attendances/AttendanceHeader";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { children } = props;
  const params = await props.params;

  return (
    <div className="flex flex-col">
      <AttendanceHeader studentId={params.id} />
      {children}
    </div>
  );
}
