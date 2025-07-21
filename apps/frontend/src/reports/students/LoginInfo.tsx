import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

export function LoginInfo({
  student,
  school,
  contacts,
}: {
  student: RouterOutputs["student"]["get"];
  school: RouterOutputs["school"]["get"];
  contacts: RouterOutputs["student"]["contacts"];
}) {
  console.log(contacts);
  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 40,
          fontSize: 10,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Helvetica",
        }}
      >
        <View style={{ flexDirection: "column", display: "flex", gap: 6 }}>
          {getHeader(school, { fontSize: 7 })}
          <View style={{ marginVertical: 10, flexDirection: "column", gap: 6 }}>
            <Text
              style={{ fontSize: 12, fontWeight: "bold", alignSelf: "center" }}
            >
              Informations de Connexion Discolaire
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              {student.lastName} {student.firstName}
            </Text>
            <Text>Matricule: {student.registrationNumber}</Text>
            <View style={{ marginVertical: 10 }}>
              <Text>
                Avec Discolaire, vous pouvez rester informé de votre progression
                académique ou de celle de votre enfant à l'école et obtenir des
                informations sur les devoirs à venir, telles que les
                descriptions des devoirs et les dates d'échéance. Les
                informations suivantes sont disponibles lorsque vous vous
                connectez à Discolaire :
              </Text>
            </View>
            <View style={{ flexDirection: "column", display: "flex", gap: 2 }}>
              <Text>- Note actuelle dans chaque classe</Text>
              <Text>
                - Moyenne générale (GPA) pour le trimestre, si applicable
              </Text>
              <Text>
                - Descriptions, notes et commentaires des enseignants pour les
                devoirs notés
              </Text>
              <Text>
                - Descriptions et dates d'échéance des devoirs à venir
              </Text>
              <Text>- Devoirs ou documents joints (pièces jointes)</Text>
              <Text>
                - Alertes par e-mail que vous pouvez configurer pour les notes
                et la présence
              </Text>
              <Text>- Informations de présence</Text>
              <Text>
                - Informations sur les relevés de notes, si applicable
              </Text>
              <Text>- Informations de facturation, si applicable</Text>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text>
                Pour accéder à ces informations, allez sur
                **www.discolaire.com** et cliquez sur le bouton vert **Se
                connecter**. Ensuite, utilisez les informations suivantes pour
                accéder à votre compte :
              </Text>
            </View>
            --- #### Informations de Connexion Familiale - **ID de l'école :**
            80 - **Nom d'utilisateur :** sbanthony - **Mot de passe :** 95351afd
            --- #### Informations de Connexion de l'Élève - **ID de l'école :**
            80 - **Nom d'utilisateur :** 1018 - **Mot de passe :** a64976ff ---
            <View>
              <Text style={{ fontWeight: "bold" }}>Remarque : </Text>{" "}
              <Text>
                Le mot de passe est sensible à la casse. Lorsque vous vous
                connectez, vous devez vérifier que votre adresse e-mail est à
                jour dans Discolaire. Vous pouvez le faire en cliquant sur le
                bouton **"Alertes"** puis sur le bouton **"Modifier les
                e-mails"**.
              </Text>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text>
                Veuillez mettre à jour vos informations d'inscription en
                cliquant sur l'onglet EnrollMe. Il est recommandé de changer
                votre mot de passe périodiquement. Discolaire est pris en charge
                par les versions actuelles d'Internet Explorer, Safari, Firefox
                et Google Chrome. Si vous rencontrez des difficultés pour vous
                connecter à Discolaire en raison de problèmes de mot de passe ou
                si votre compte est verrouillé, veuillez contacter le bureau de
                votre école. Votre école gère tous les comptes des élèves et
                peut réinitialiser votre mot de passe ou déverrouiller votre
                compte si nécessaire. --- ###
              </Text>
            </View>
            Téléchargez l'application Discolaire gratuitement ! Scannez le code
            QR ou recherchez "Discolaire Student" dans l'App Store de votre
            appareil. - **Disponible sur l'App Store** - **Disponible sur Google
            Play** --- Si vous souhaitez que je vous aide avec d'autres
            traductions ou questions, n'hésitez pas ! 😊
          </View>
        </View>
      </Page>
    </Document>
  );
}
