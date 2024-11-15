export default function Page() {
  return (
    <div className="flex h-screen flex-col">
      <header className="fixed top-0 z-10 w-full bg-gray-800 p-4 text-white">
        <h1 className="text-xl">Dashboard Header</h1>
      </header>

      <div className="flex flex-1 pt-16">
        <aside className="fixed top-16 h-screen w-64 overflow-y-auto bg-gray-700 p-4 text-white">
          <nav>
            <ul>
              <li className="mb-4">
                <a href="#">Menu Item 1</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 2</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-4">
                <a href="#">Menu Item 1</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 2</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-4">
                <a href="#">Menu Item 1</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 2</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-4">
                <a href="#">Menu Item 1</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 2</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-4">
                <a href="#">Menu Item 1</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 2</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-4">
                <a href="#">Menu Item 1</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 2</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-4">
                <a href="#">Menu Item 1</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 2</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-4">
                <a href="#">Menu Item 1</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 2</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
              <li className="mb-10">
                <a href="#">Menu Item 10</a>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="ml-64 flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl">
            <h2 className="mb-6 text-2xl font-semibold">Dashboard Content</h2>
            <p className="mb-4">This is where your content goes.</p>
            <p className="mb-4">
              Add as much content as you need, and it will scroll independently
              of the sidebar.
            </p>
            <p className="mb-4">
              Voici l'agrément mis à jour avec les précisions concernant la
              durée et les services inclus : --- **AGRÉMENT D'UTILISATION DU
              LOGICIEL "DISCOLAIRE"** **Entre les soussignés :** 1. **Le
              Fournisseur** Nom : [Nom du Fournisseur] Fonction : Développeur et
              propriétaire du logiciel "Discolaire" Adresse : [Adresse du
              Fournisseur] 2. **Le Directeur de l'École** Nom : [Nom du
              Directeur] Nom de l'école : [Nom de l'École] Adresse de l'école :
              [Adresse de l'École] 3. **Le Trésorier de l'École** Nom : [Nom du
              Trésorier] Nom de l'école : [Nom de l'École] Adresse de l'école :
              [Adresse de l'École] 4. **Le Trésorier de l'Union** Nom : [Nom du
              Trésorier de l'Union] Nom de l'union : [Nom de l'Union] Adresse :
              [Adresse de l'Union] **Objet de l'agrément** Le présent agrément a
              pour objet de définir les modalités d'utilisation du logiciel
              "Discolaire" (Digitalisation Scolaire) par l'école [Nom de
              l'École]. Le logiciel est fourni par le Fournisseur pour une durée
              d'un an moyennant une somme de **500 000 FCFA**. **Services
              inclus** Pendant la durée d'un an couverte par cet agrément, le
              Fournisseur s'engage à fournir : - Un accès complet au logiciel
              "Discolaire" pour une utilisation par l'école. - La maintenance du
              logiciel, incluant toutes les corrections de bogues et mises à
              jour nécessaires. - Les modifications demandées par l'école, sans
              frais supplémentaires. **Modalités de paiement** Le montant total
              de **500 000 CFA** sera payé en une seule tranche par l'école à la
              signature de cet agrément. Le paiement sera effectué par virement
              bancaire sur le compte du Fournisseur ou par tout autre mode
              convenu entre les parties. **Durée de l'agrément** L'agrément
              prend effet à la date de signature pour une durée d'un an. À
              l'issue de cette période, un nouvel agrément devra être signé pour
              prolonger l'utilisation du logiciel. **Responsabilités des
              parties** - **Le Fournisseur** s'engage à fournir un support
              technique, les mises à jour et les modifications nécessaires
              pendant la durée de l'agrément. - **L'école** s'engage à utiliser
              le logiciel conformément aux conditions définies et à effectuer le
              paiement convenu. - **Le Trésorier de l'École** et **le Trésorier
              de l'Union** s'engagent à garantir la bonne gestion financière de
              la transaction. **Résiliation** En cas de manquement grave à l'une
              des clauses du présent agrément, chaque partie peut résilier cet
              agrément avec un préavis de [délai de préavis]. **Signature des
              parties** Fait à [Lieu], le [Date] - **Le Fournisseur** Signature:
              ________________________ - **Le Directeur de l'École** Signature:
              ________________________ - **Le Trésorier de l'École** Signature:
              ________________________ - **Le Trésorier de l'Union** Signature:
              ________________________ --- Cet agrément inclut maintenant la
              durée d'un an et les services gratuits de maintenance et
              modifications. Si vous souhaitez ajouter d'autres détails ou faire
              des ajustements, n'hésitez pas à me le dire..
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
