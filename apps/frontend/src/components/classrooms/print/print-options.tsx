import { routes } from "@/configs/routes";
import Link from "next/link";

export function ClassroomPrintOptions() {
  const items = [
    "Liste des élèves",
    "Liste des nouveaux élèves",
    "Liste des matières",
    "Situation financière",
    "Liste des enseignants",
    "Liste des cours",
    "Emplois du temps",
    "Liste des examens",
    "Liste des notes",
    "Liste des absences",
    "Liste des retards",
    "Liste des sanctions",
    "Liste des récompenses",
    "Liste des événements",
    "Liste des tâches",
    "Liste des documents",
    "Liste des paramètres",
    "Liste des utilisateurs",
    "Liste des rôles",
    "Liste des permissions",
    "Liste des groupes",
    "Liste des notifications",
    "Liste des messages",
    "Liste des conversations",
    "Liste des paramètres de messagerie",
    "Liste des paramètres de notification",
    "Liste des paramètres de sécurité",
    "Liste des paramètres de l'application",
    "Liste des paramètres de l'établissement",
    "Liste des paramètres de l'année scolaire",
    "Liste des paramètres de la classe",
    "Liste des paramètres de la salle",
    "Liste des paramètres du cours",
    "Liste des paramètres de l'examen",
    "Liste des paramètres de la note",
    "Liste des paramètres de l'absence",
    "Liste des paramètres",
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, index) => {
        return (
          <div className="flex flex-row gap-2" key={index}>
            <span>{index + 100}.</span>
            <Link
              href={routes.reports.index}
              target="_blank"
              className="hover:underline hover:text-blue-500"
            >
              {item}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
