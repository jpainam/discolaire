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
  startDate: string;
  endDate: string;
  motif: string;
  studentName: string;
  school: School;
}

export const ExclusionEmail = ({
  title = "Notification d'exclusion temporaire de Dupont Pierre",
  school = defaultSchool,
  motif = "non respect du reglèment intérieur",
  startDate = "ven, 15 juin",
  endDate = "Merc, 21 Juin",
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
              Nous vous informons que votre enfant, {studentName}, a fait
              l'objet d'une exclusion temporaire de l'établissement à compter du
              {startDate} jusqu'au {endDate}. Cette décision a été prise en
              raison de {motif}.
              <br />
              Nous vous invitons à rencontrer l'équipe éducative afin de
              discuter de cette situation et des mensures à prendre pour éviter
              de futurs incidents. Votre présence est essentielle pour
              accompagner votre enfant dans son parcous scolaire.
              <br />
              Pour fixer un rendez-vous ou pour toute question, veuillez nous
              contacter.
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

export default ExclusionEmail;
