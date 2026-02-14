import { DocumentOverview } from "~/components/documents/DocumentOverview";

export function ClassroomDocumentOverview({
  classroomId,
}: {
  classroomId: string;
}) {
  return <DocumentOverview entityId={classroomId} entityType="classroom" />;
}
