"use server";

import { headers } from "next/headers";

import { getDb } from "@repo/db";

import { env } from "~/env";

const permission_name: Record<string, string> = {
  "classroom.read": "Consulter la liste des salles de classe",
  "classroom.create": "Créer une nouvelle salle de classe",
  "classroom.update": "Modifier les informations d'une salle de classe",
  "classroom.delete": "Supprimer une salle de classe",

  "module.read": "Consulter les modules",
  "module.create": "Créer un module",
  "module.update": "Modifier un module",
  "module.delete": "Supprimer un module",

  "student.read": "Consulter les élèves",
  "student.create": "Créer un élève",
  "student.update": "Modifier les informations d'un élève",
  "student.delete": "Supprimer un élève",

  "staff.read": "Consulter le personnel",
  "staff.create": "Créer un membre du personnel",
  "staff.update": "Modifier les informations d'un membre du personnel",
  "staff.delete": "Supprimer un membre du personnel",

  "contact.read": "Consulter les contacts",
  "contact.create": "Créer un contact",
  "contact.update": "Modifier un contact",
  "contact.delete": "Supprimer un contact",

  "subject.read": "Consulter les matières",
  "subject.create": "Créer une matière",
  "subject.update": "Modifier une matière",
  "subject.delete": "Supprimer une matière",

  "program.read": "Consulter les programmes",
  "program.create": "Créer un programme",
  "program.update": "Modifier un programme",
  "program.delete": "Supprimer un programme",

  "enrollment.read": "Consulter les inscriptions",
  "enrollment.create": "Créer une inscription",
  "enrollment.update": "Modifier une inscription",
  "enrollment.delete": "Supprimer une inscription",

  "fee.read": "Consulter les frais scolaires",
  "fee.create": "Créer des frais scolaires",
  "fee.update": "Modifier des frais scolaires",
  "fee.delete": "Supprimer des frais scolaires",

  "transaction.read": "Consulter les transactions",
  "transaction.create": "Créer une transaction",
  "transaction.update": "Modifier une transaction",
  "transaction.delete": "Supprimer une transaction",

  "library.read": "Consulter la bibliothèque",
  "library.create": "Ajouter un élément à la bibliothèque",
  "library.update": "Modifier un élément de la bibliothèque",
  "library.delete": "Supprimer un élément de la bibliothèque",

  "gradesheet.read": "Consulter les feuilles de notes",
  "gradesheet.create": "Créer une feuille de notes",
  "gradesheet.update": "Modifier une feuille de notes",
  "gradesheet.delete": "Supprimer une feuille de notes",

  "role.read": "Consulter les rôles",
  "role.create": "Créer un rôle",
  "role.update": "Modifier un rôle",
  "role.delete": "Supprimer un rôle",

  "permission.read": "Consulter les permissions",
  "permission.create": "Créer une permission",
  "permission.update": "Modifier une permission",
  "permission.delete": "Supprimer une permission",

  "attendance.read": "Consulter les présences",
  "attendance.create": "Enregistrer une présence",
  "attendance.update": "Modifier une présence",
  "attendance.delete": "Supprimer une présence",

  "reportcard.read": "Consulter les bulletins scolaires",
  "reportcard.create": "Créer un bulletin scolaire",
  "reportcard.update": "Modifier un bulletin scolaire",
  "reportcard.delete": "Supprimer un bulletin scolaire",

  "policy.read": "Consulter les politiques",
  "policy.create": "Créer une politique",
  "policy.update": "Modifier une politique",
  "policy.delete": "Supprimer une politique",

  "user.read": "Consulter les utilisateurs",
  "user.create": "Créer un utilisateur",
  "user.update": "Modifier un utilisateur",
  "user.delete": "Supprimer un utilisateur",

  "assignment.read": "Consulter les devoirs",
  "assignment.create": "Créer un devoir",
  "assignment.update": "Modifier un devoir",
  "assignment.delete": "Supprimer un devoir",

  "timetable.read": "Consulter les emplois du temps",
  "timetable.create": "Créer un emploi du temps",
  "timetable.update": "Modifier un emploi du temps",
  "timetable.delete": "Supprimer un emploi du temps",

  "subscription.read": "Consulter les abonnements",
  "subscription.create": "Créer un abonnement",
  "subscription.update": "Modifier un abonnement",
  "subscription.delete": "Supprimer un abonnement",

  "inventory.read": "Consulter l'inventaire",
  "inventory.create": "Ajouter un élément à l'inventaire",
  "inventory.update": "Modifier un élément de l'inventaire",
  "inventory.delete": "Supprimer un élément de l'inventaire",

  "communication.create": "Créer une communication",

  "school.read": "Consulter les informations de l'école",
  "school.update": "Modifier les informations de l'école",
  "school.delete": "Supprimer l'école",

  "staff.attendance.create": "Créer une présence du personnel",
  "staff.attendance.update": "Modifier une présence du personnel",
  "staff.attendance.delete": "Supprimer une présence du personnel",

  "menu:administration.read": "Accéder au menu Administration",
  "menu:library.read": "Accéder au menu Bibliothèque",
  "menu:staff.read": "Accéder au menu Personnel",
  "menu:communication.read": "Accéder au menu Communication",
};
export async function updatePermission() {
  const heads = await headers();
  const tenant = heads.get("discolaire-tenant") ?? env.DEFAULT_TENANT;
  if (!tenant) throw new Error("Tenant could not be determined.");

  const db = getDb({ connectionString: env.DATABASE_URL, tenant });

  await Promise.all(
    Object.entries(permission_name).map(([resource, name]) =>
      db.permission.updateMany({
        where: { resource },
        data: { name },
      }),
    ),
  );
}
