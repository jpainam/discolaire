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
  motif: string;
  studentName: string;
  school: School;
}

export const ConsigneEmail = ({
  title = "Notification de consigne de votre enfant",
  school = defaultSchool,
  date = "ven, 12 Juin",
  motif = "comportement inapproprié",
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
              Nous vous informons que votre enfant, {studentName}, a été placé
              en consigne le {date} en raison de:{" "}
            </Text>
            <Text className="text-center text-[#121212]">
              <b>{motif} </b>
            </Text>
            <Text className="text-[#121212]">
              Cette mesure vise à encourager un comportement plus respondable et
              un meilleur respect des règles de l'école. Nous vous invitons à
              discuter avec votre enfant pour éviter que cette situation ne se
              reproduise à l'avenir.
              <br />
              Pour toute question our précision, n'hésitez pas à nous contacter.
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

export default ConsigneEmail;
