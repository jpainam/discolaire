import {
  Body,
  Container,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

import { Head } from "../components/Head";
import { Logo } from "../components/logo";
import { getAssetUrl } from "../utils";

interface School {
  logo?: string | null;
  name: string;
  id: string;
}

const assetUrl = getAssetUrl();
const defaultSchool = {
  logo: `${assetUrl}/images/logo-round.png`,
  name: "Institut Polyvalent Wague",
  id: "1",
};
interface Props {
  title: string;
  date: string;
  studentName: string;
  school: School;
}

export const LatenessEmail = ({
  title = "Notification de retard de Doe Joe",
  school = defaultSchool,
  date = "ven, 12 Juin",
  studentName = "Dupont Pierre",
}: Props) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{title}</Preview>

        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo logoUrl={`${assetUrl}/images/logo-round.png`} />
            <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
              Madame/Monsieur
            </Heading>

            <br />

            <span className="font-medium">Madame/Monsieur</span>
            <Text className="text-[#121212]">
              Nous souhaitons vous informer que votre enfant, {studentName}, est
              arrivé(e) en retard en classe le {date}.
              <br />
              Nous vous encourageons à veuillez à ce que votre enfant arrive à
              l'heure afin de favoriser son apprentissage et le bon déroulement
              des cours.
              <br />
              Merci de votre compréhension.
            </Text>
            <Text className="text-[#121212]">
              Cordialement, <br />
              La direction <br />
              {school.name}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default LatenessEmail;
