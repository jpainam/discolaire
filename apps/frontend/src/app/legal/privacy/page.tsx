import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <Link
            href="/auth/login"
            className="text-muted-foreground hover:text-foreground text-sm underline"
          >
            ← Retour à la connexion
          </Link>
        </div>

        <h1 className="mb-2 text-3xl font-bold">
          Politique de confidentialité
        </h1>
        <p className="text-muted-foreground mb-10 text-sm">
          Dernière mise à jour : mars 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-semibold">1. Introduction</h2>
            <p>
              La présente politique de confidentialité décrit la manière dont
              Discolaire collecte, utilise et protège les données personnelles
              des utilisateurs de la plateforme. Nous nous engageons à protéger
              la vie privée de nos utilisateurs et à traiter leurs données
              conformément aux réglementations en vigueur, notamment le
              Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              2. Données collectées
            </h2>
            <p>
              Dans le cadre de l&apos;utilisation de Discolaire, nous sommes
              amenés à collecter les données suivantes :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Données d&apos;identification :</strong> nom, prénom,
                adresse e-mail, nom d&apos;utilisateur ;
              </li>
              <li>
                <strong>Données relatives aux élèves :</strong> informations
                scolaires, présences, notes, dossier médical (si renseigné) ;
              </li>
              <li>
                <strong>Données de connexion :</strong> adresse IP, horodatage
                des connexions, journaux d&apos;activité ;
              </li>
              <li>
                <strong>Données financières :</strong> transactions liées à la
                scolarité (frais d&apos;inscription, paiements).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              3. Finalités du traitement
            </h2>
            <p>Les données collectées sont utilisées aux fins suivantes :</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Gestion administrative des élèves et du personnel de
                l&apos;établissement ;
              </li>
              <li>Suivi pédagogique et éducatif ;</li>
              <li>
                Communication entre l&apos;établissement, les familles et le
                personnel ;
              </li>
              <li>
                Sécurisation et authentification des accès à la plateforme ;
              </li>
              <li>
                Amélioration du service et résolution de problèmes techniques ;
              </li>
              <li>Respect des obligations légales et réglementaires.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              4. Base légale du traitement
            </h2>
            <p>
              Le traitement des données repose sur les bases légales suivantes :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Exécution d&apos;un contrat :</strong> pour la
                fourniture du service de gestion scolaire ;
              </li>
              <li>
                <strong>Intérêt légitime :</strong> pour la sécurisation du
                service et la journalisation des activités ;
              </li>
              <li>
                <strong>Obligation légale :</strong> pour le respect des
                réglementations applicables aux établissements scolaires ;
              </li>
              <li>
                <strong>Consentement :</strong> pour les traitements spécifiques
                qui le requièrent.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              5. Conservation des données
            </h2>
            <p>
              Les données personnelles sont conservées pour la durée nécessaire
              à l&apos;accomplissement des finalités pour lesquelles elles ont
              été collectées, et conformément aux obligations légales
              applicables. À titre indicatif :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Données des élèves : durée de scolarisation et archivage
                réglementaire ;
              </li>
              <li>Journaux d&apos;activité : 12 mois ;</li>
              <li>Données de connexion : 6 mois.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              6. Partage des données
            </h2>
            <p>
              Discolaire ne vend pas et ne loue pas les données personnelles de
              ses utilisateurs à des tiers. Les données peuvent être partagées
              uniquement dans les cas suivants :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Avec les prestataires techniques assurant l&apos;hébergement et
                la maintenance de la plateforme, dans le strict cadre de leurs
                missions ;
              </li>
              <li>Sur réquisition judiciaire ou obligation légale ;</li>
              <li>Avec le consentement explicite de la personne concernée.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              7. Sécurité des données
            </h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données contre tout accès non
              autorisé, perte, destruction ou altération. Ces mesures incluent
              le chiffrement des données en transit, le contrôle des accès et la
              journalisation des activités.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">8. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants concernant
              vos données personnelles :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Droit d&apos;accès :</strong> obtenir une copie des
                données vous concernant ;
              </li>
              <li>
                <strong>Droit de rectification :</strong> corriger des données
                inexactes ou incomplètes ;
              </li>
              <li>
                <strong>Droit à l&apos;effacement :</strong> demander la
                suppression de vos données dans les conditions prévues par la
                loi ;
              </li>
              <li>
                <strong>Droit à la limitation :</strong> restreindre le
                traitement de vos données ;
              </li>
              <li>
                <strong>Droit d&apos;opposition :</strong> vous opposer au
                traitement de vos données pour des motifs légitimes ;
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> recevoir vos données
                dans un format structuré et lisible par machine.
              </li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous à{" "}
              <a
                href="mailto:contact@discolaire.com"
                className="text-primary underline"
              >
                contact@discolaire.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">9. Cookies</h2>
            <p>
              Discolaire utilise des cookies strictement nécessaires au
              fonctionnement de la plateforme (session d&apos;authentification,
              préférences d&apos;interface). Aucun cookie publicitaire ou de
              traçage tiers n&apos;est utilisé.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              10. Modifications de la politique
            </h2>
            <p>
              Nous nous réservons le droit de modifier la présente politique de
              confidentialité à tout moment. Les utilisateurs seront informés de
              toute modification substantielle. La version en vigueur est celle
              publiée sur cette page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">11. Contact</h2>
            <p>
              Pour toute question relative à la protection de vos données
              personnelles, vous pouvez nous contacter à{" "}
              <a
                href="mailto:contact@discolaire.com"
                className="text-primary underline"
              >
                contact@discolaire.com
              </a>
              .
            </p>
            <p className="mt-2">
              Vous avez également le droit d&apos;introduire une réclamation
              auprès de l&apos;autorité de contrôle compétente en matière de
              protection des données de votre pays.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
