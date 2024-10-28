import { Button, Heading, Html, Tailwind, Text } from "@react-email/components";

export function FakeGradeReportEmail({
  studentName,
  reportedBy,
  gradeDetails,
  reportComment,
}: {
  studentName: string;
  reportedBy: string;
  gradeDetails: {
    grade: string;
    subject: string;
    date: string;
  };
  reportComment?: string;
}) {
  return (
    <Html>
      <Tailwind>
        <div className="bg-gray-100 px-5 py-10">
          <div className="mx-auto max-w-lg rounded-md bg-white p-8 shadow-lg">
            <Heading className="mb-4 text-2xl font-semibold text-gray-800">
              Signalement de fausse note
            </Heading>
            <Text className="mb-6 text-gray-700">Bonjour Administrateur,</Text>
            <Text className="mb-6 text-gray-700">
              Une fausse note a été signalée dans le système de gestion scolaire
              par <strong>{reportedBy}</strong>.
            </Text>
            <Text className="mb-4 text-gray-700">
              <strong>Détails de l'élève :</strong>
              <br />
              Nom : {studentName}
              <br />
              Note : {gradeDetails.grade}
              <br />
              Matière : {gradeDetails.subject}
              <br />
              Date : {gradeDetails.date}
            </Text>
            <Text className="mb-4 text-gray-700">
              <strong>Commentaire du rapport :</strong>
              <br />
              {reportComment ?? "Aucun commentaire"}
            </Text>
            <Button
              href="https://votre-systeme-gestion.com/gestion-grades"
              className="mt-6 rounded bg-blue-500 px-4 py-2 text-white"
            >
              Voir la note signalée
            </Button>
            <Text className="mt-8 text-sm text-gray-500">
              Cet email est généré automatiquement. Veuillez ne pas répondre.
            </Text>
          </div>
        </div>
      </Tailwind>
    </Html>
  );
}
