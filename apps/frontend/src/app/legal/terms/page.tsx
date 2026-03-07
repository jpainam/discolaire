import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
};

export default function TermsPage() {
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
          Conditions d&apos;utilisation
        </h1>
        <p className="text-muted-foreground mb-10 text-sm">
          Dernière mise à jour : mars 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              1. Acceptation des conditions
            </h2>
            <p>
              En accédant à la plateforme Discolaire et en l&apos;utilisant,
              vous acceptez d&apos;être lié par les présentes conditions
              d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions,
              veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              2. Description du service
            </h2>
            <p>
              Discolaire est une plateforme de gestion scolaire destinée aux
              établissements d&apos;enseignement. Elle permet la gestion des
              élèves, du personnel, des classes, des notes, des présences, ainsi
              que d&apos;autres fonctionnalités administratives liées à la vie
              d&apos;un établissement scolaire.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">3. Accès au service</h2>
            <p>
              L&apos;accès à Discolaire est réservé aux utilisateurs autorisés
              par un administrateur de l&apos;établissement. Chaque utilisateur
              est responsable de la confidentialité de ses identifiants de
              connexion et s&apos;engage à ne pas les partager avec des tiers.
            </p>
            <p className="mt-2">
              Vous vous engagez à nous informer immédiatement en cas
              d&apos;utilisation non autorisée de votre compte.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              4. Utilisation acceptable
            </h2>
            <p>En utilisant Discolaire, vous vous engagez à :</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Utiliser le service uniquement à des fins légitimes et légales ;
              </li>
              <li>
                Ne pas tenter d&apos;accéder à des données qui ne vous sont pas
                destinées ;
              </li>
              <li>Ne pas perturber le fonctionnement du service ;</li>
              <li>
                Respecter la vie privée des autres utilisateurs et des élèves ;
              </li>
              <li>
                Vous conformer aux lois et réglementations applicables,
                notamment en matière de protection des données personnelles.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              5. Données et confidentialité
            </h2>
            <p>
              Le traitement des données personnelles est régi par notre{" "}
              <Link href="/legal/privacy" className="text-primary underline">
                Politique de confidentialité
              </Link>
              . En utilisant Discolaire, vous consentez au traitement de vos
              données conformément à cette politique.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              6. Propriété intellectuelle
            </h2>
            <p>
              Tous les droits de propriété intellectuelle relatifs à Discolaire
              (code source, interface, contenu, marques) sont et restent la
              propriété exclusive de leurs titulaires respectifs. Aucune licence
              n&apos;est accordée au-delà de l&apos;utilisation normale du
              service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              7. Limitation de responsabilité
            </h2>
            <p>
              Discolaire est fourni &quot;tel quel&quot;. Nous ne garantissons
              pas une disponibilité ininterrompue du service. En aucun cas, nous
              ne saurions être tenus responsables de dommages indirects,
              accessoires ou consécutifs résultant de l&apos;utilisation ou de
              l&apos;impossibilité d&apos;utiliser le service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              8. Modifications des conditions
            </h2>
            <p>
              Nous nous réservons le droit de modifier les présentes conditions
              à tout moment. Les modifications prendront effet dès leur
              publication sur cette page. Il vous appartient de consulter
              régulièrement cette page pour prendre connaissance des éventuelles
              modifications.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">9. Droit applicable</h2>
            <p>
              Les présentes conditions sont régies par le droit applicable dans
              le pays d&apos;exercice de l&apos;établissement scolaire concerné.
              Tout litige relatif à l&apos;utilisation du service sera soumis
              aux juridictions compétentes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">10. Contact</h2>
            <p>
              Pour toute question relative aux présentes conditions
              d&apos;utilisation, vous pouvez nous contacter à l&apos;adresse
              suivante :{" "}
              <a
                href="mailto:contact@discolaire.com"
                className="text-primary underline"
              >
                contact@discolaire.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
