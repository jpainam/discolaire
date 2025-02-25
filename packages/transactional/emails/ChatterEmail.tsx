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
  studentName: string;
  school: School;
}

export const ChatterEmail = ({
  title = "Rappel concernant le bavardage en classe",
  school = defaultSchool,
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
              Nous souhaitons vous informer que, {studentName}, a été rappelé(e)
              à l'ordre en raison de bavardages fréquents en classe; ce qui
              perturbe le déroulement des cours. Nous vous prions de bien
              vouloir en discuter avec lui/elle pour éviter toute récidive.
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

export default ChatterEmail;
