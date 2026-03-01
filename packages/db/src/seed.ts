//import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/client/client";

// import appreciations from "./shared/appreciation.ts"; workaround for ts-node issue with import
const databaseUrl = process.env.DATABASE_URL;
if (!process.env.DATABASE_URL) {
  throw new Error("Missing POSTGRES_URL");
}
const adapter = new PrismaPg({ connectionString: databaseUrl });

const client = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Notification categories & configs
// ---------------------------------------------------------------------------

const NOTIFICATION_CATEGORIES = [
  { key: "attendance", label: "Assiduité", order: 1 },
  { key: "academic", label: "Académique", order: 2 },
  { key: "behaviour", label: "Comportement", order: 3 },
  { key: "finance", label: "Finance", order: 4 },
  { key: "health-wellbeing", label: "Santé et bien-être", order: 5 },
  { key: "events-activities", label: "Événements et activités", order: 6 },
  { key: "admissions", label: "Admissions", order: 7 },
  { key: "communication", label: "Communication", order: 8 },
  { key: "system-admin", label: "Système et administration", order: 9 },
  { key: "reports", label: "Bulletins et rapports", order: 10 },
] as const;

type CategoryKey = (typeof NOTIFICATION_CATEGORIES)[number]["key"];

const NOTIFICATION_CONFIGS: {
  templateKey: string;
  categoryKey: CategoryKey;
  name: string;
  description: string;
  allowStaff: boolean;
  allowStudent: boolean;
  allowContact: boolean;
}[] = [
  // ── Attendance ──────────────────────────────────────────────────────────
  {
    templateKey: "absence-notification",
    categoryKey: "attendance",
    name: "Notification d'absence",
    description: "Envoyé lorsqu'un élève est marqué absent pour la journée.",
    allowStaff: true,
    allowStudent: false,
    allowContact: true,
  },
  {
    templateKey: "late-arrival",
    categoryKey: "attendance",
    name: "Alerte de retard",
    description: "Notifie lorsqu'un élève arrive après l'heure de début des cours.",
    allowStaff: true,
    allowStudent: false,
    allowContact: true,
  },
  {
    templateKey: "attendance-summary-quarterly",
    categoryKey: "attendance",
    name: "Bilan de présence (trimestriel)",
    description: "Récapitulatif trimestriel de la présence de l'élève envoyé aux parents.",
    allowStaff: false,
    allowStudent: false,
    allowContact: true,
  },
  // ── Academic ─────────────────────────────────────────────────────────────
  {
    templateKey: "grade-published",
    categoryKey: "academic",
    name: "Note publiée",
    description: "Notifie lorsqu'un enseignant publie une note pour une évaluation.",
    allowStaff: false,
    allowStudent: true,
    allowContact: true,
  },
  {
    templateKey: "grade-report-available",
    categoryKey: "academic",
    name: "Bulletin disponible",
    description: "Notifie lorsque le bulletin trimestriel est disponible en ligne.",
    allowStaff: false,
    allowStudent: true,
    allowContact: true,
  },
  {
    templateKey: "grade-report-dispute",
    categoryKey: "academic",
    name: "Contestation de bulletin (interne)",
    description: "Alerte interne lorsqu'un bulletin est contesté.",
    allowStaff: true,
    allowStudent: false,
    allowContact: false,
  },
  {
    templateKey: "exam-reminder-admin",
    categoryKey: "academic",
    name: "Rappel d'examen (administration)",
    description: "Rappel du calendrier des examens pour les administrateurs.",
    allowStaff: true,
    allowStudent: false,
    allowContact: false,
  },
  {
    templateKey: "exam-week-parent",
    categoryKey: "academic",
    name: "Avis de semaine d'examens",
    description: "Notification de la semaine d'examens pour les parents et tuteurs.",
    allowStaff: false,
    allowStudent: false,
    allowContact: true,
  },
  // ── Behaviour ────────────────────────────────────────────────────────────
  {
    templateKey: "behaviour-note",
    categoryKey: "behaviour",
    name: "Note disciplinaire",
    description: "Note disciplinaire enregistrée pour un élève.",
    allowStaff: true,
    allowStudent: false,
    allowContact: true,
  },
  {
    templateKey: "detention-notice",
    categoryKey: "behaviour",
    name: "Avis de consigne",
    description: "Informe le parent ou tuteur qu'une consigne a été attribuée à l'élève.",
    allowStaff: false,
    allowStudent: true,
    allowContact: true,
  },
  {
    templateKey: "exclusion-notice",
    categoryKey: "behaviour",
    name: "Avis d'exclusion",
    description: "Notification officielle d'une exclusion temporaire.",
    allowStaff: true,
    allowStudent: false,
    allowContact: true,
  },
  // ── Finance ──────────────────────────────────────────────────────────────
  {
    templateKey: "transaction-confirmation",
    categoryKey: "finance",
    name: "Confirmation de transaction",
    description: "Envoyé lorsqu'une transaction de paiement est confirmée.",
    allowStaff: false,
    allowStudent: false,
    allowContact: true,
  },
  {
    templateKey: "transaction-pending",
    categoryKey: "finance",
    name: "Transaction en attente",
    description: "Notifie qu'une transaction est en attente de validation.",
    allowStaff: false,
    allowStudent: false,
    allowContact: true,
  },
  {
    templateKey: "transaction-validated",
    categoryKey: "finance",
    name: "Transaction validée",
    description: "Confirme qu'une transaction de paiement a été validée.",
    allowStaff: false,
    allowStudent: false,
    allowContact: true,
  },
  {
    templateKey: "transactions-summary",
    categoryKey: "finance",
    name: "Récapitulatif des transactions",
    description: "Récapitulatif de toutes les transactions financières.",
    allowStaff: false,
    allowStudent: false,
    allowContact: true,
  },
  // ── Events & Activities ──────────────────────────────────────────────────
  {
    templateKey: "classroom-timetable",
    categoryKey: "events-activities",
    name: "Emploi du temps de la classe",
    description: "Emploi du temps de la classe partagé avec les élèves et les parents.",
    allowStaff: false,
    allowStudent: true,
    allowContact: false,
  },
  // ── Admissions ───────────────────────────────────────────────────────────
  {
    templateKey: "invitation",
    categoryKey: "admissions",
    name: "Invitation",
    description: "Invitation envoyée à un nouveau membre de la communauté scolaire.",
    allowStaff: false,
    allowStudent: false,
    allowContact: true,
  },
  {
    templateKey: "student-created",
    categoryKey: "admissions",
    name: "Compte élève créé",
    description: "Confirmation lors de la création d'un nouveau dossier élève.",
    allowStaff: false,
    allowStudent: true,
    allowContact: true,
  },
  {
    templateKey: "enrollment-confirmation",
    categoryKey: "admissions",
    name: "Confirmation d'inscription",
    description: "Confirme qu'un élève a été inscrit dans une classe.",
    allowStaff: false,
    allowStudent: true,
    allowContact: true,
  },
  {
    templateKey: "student-contact-linked",
    categoryKey: "admissions",
    name: "Contact rattaché à l'élève",
    description: "Notification lors du rattachement d'un contact au dossier d'un élève.",
    allowStaff: false,
    allowStudent: false,
    allowContact: true,
  },
  // ── System & Admin ───────────────────────────────────────────────────────
  {
    templateKey: "password-reset",
    categoryKey: "system-admin",
    name: "Réinitialisation du mot de passe",
    description: "Lien sécurisé pour réinitialiser les identifiants de connexion.",
    allowStaff: true,
    allowStudent: true,
    allowContact: true,
  },
  {
    templateKey: "password-reset-success",
    categoryKey: "system-admin",
    name: "Mot de passe réinitialisé",
    description: "Confirmation que le mot de passe a été réinitialisé avec succès.",
    allowStaff: true,
    allowStudent: true,
    allowContact: true,
  },
  {
    templateKey: "welcome",
    categoryKey: "system-admin",
    name: "E-mail de bienvenue",
    description: "E-mail d'accueil envoyé lors de la création d'un nouveau compte.",
    allowStaff: true,
    allowStudent: true,
    allowContact: true,
  },
  {
    templateKey: "staff-weekly-timetable",
    categoryKey: "system-admin",
    name: "Emploi du temps hebdomadaire du personnel",
    description: "Planning hebdomadaire envoyé au personnel enseignant et administratif.",
    allowStaff: true,
    allowStudent: false,
    allowContact: false,
  },
  {
    templateKey: "feedback-submitted",
    categoryKey: "system-admin",
    name: "Retour utilisateur soumis",
    description: "Notification lors de la soumission d'un retour utilisateur.",
    allowStaff: true,
    allowStudent: false,
    allowContact: false,
  },
];

async function seedNotificationCategoriesAndConfigs(
  db: PrismaClient,
): Promise<void> {
  const schools = await db.school.findMany({ select: { id: true } });
  console.log(`  Seeding notification data for ${schools.length} school(s)…`);

  for (const school of schools) {
    // 1. Upsert categories and build a key → id map.
    const categoryIdByKey = new Map<string, string>();

    for (const cat of NOTIFICATION_CATEGORIES) {
      const record = await db.notificationCategory.upsert({
        where: { schoolId_key: { schoolId: school.id, key: cat.key } },
        update: { label: cat.label, order: cat.order },
        create: {
          schoolId: school.id,
          key: cat.key,
          label: cat.label,
          order: cat.order,
        },
        select: { id: true, key: true },
      });
      categoryIdByKey.set(record.key, record.id);
    }

    // 2. Upsert configs, referencing the category IDs from above.
    for (const cfg of NOTIFICATION_CONFIGS) {
      const categoryId = categoryIdByKey.get(cfg.categoryKey);
      await db.notificationConfig.upsert({
        where: {
          schoolId_templateKey_channel: {
            schoolId: school.id,
            templateKey: cfg.templateKey,
            channel: "EMAIL",
          },
        },
        update: {
          categoryId,
          name: cfg.name,
          description: cfg.description,
          allowStaff: cfg.allowStaff,
          allowStudent: cfg.allowStudent,
          allowContact: cfg.allowContact,
        },
        create: {
          schoolId: school.id,
          templateKey: cfg.templateKey,
          channel: "EMAIL",
          categoryId,
          name: cfg.name,
          description: cfg.description,
          enabled: true,
          allowStaff: cfg.allowStaff,
          allowStudent: cfg.allowStudent,
          allowContact: cfg.allowContact,
        },
      });
    }

    console.log(
      `    ✓ school ${school.id}: ${NOTIFICATION_CATEGORIES.length} categories, ${NOTIFICATION_CONFIGS.length} configs`,
    );
  }
}

// // npx prisma db seed --preview-feature
//
async function main() {
  console.log("Seeding database...");

  await seedNotificationCategoriesAndConfigs(client);
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })

  .finally(async () => {
    await client.$disconnect();
  });
