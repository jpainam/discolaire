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

interface School {
  logo?: string | null;
  name: string;
  id: string;
}

const defaultSchool = {
  logo: `logo-round.png`,
  name: "Institut Polyvalent Wague",
  id: "1",
};

interface Props {
  studentName: string;
  classroomName: string;
  schoolYearName: string;
  school: School;
}

export const EnrollmentEmail = ({
  studentName = "Dupont Pierre",
  classroomName = "6ème A",
  schoolYearName = "2024-2025",
  school = defaultSchool,
}: Props) => {
  const title = `${classroomName} - ${schoolYearName}`;

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
            <Logo logoUrl={school.logo} />
            <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
              Madame / Monsieur
            </Heading>

            <br />

            <Text className="text-[#121212]">
              Nous avons le plaisir de vous informer que{" "}
              <span className="font-semibold">{studentName}</span> a été
              inscrit(e) en{" "}
              <span className="font-semibold">{classroomName}</span> pour
              l'année scolaire{" "}
              <span className="font-semibold">{schoolYearName}</span>.
            </Text>

            <Text className="text-[#121212]">
              Nous vous souhaitons une excellente année scolaire et restons à
              votre disposition pour toute question.
            </Text>

            <Text className="text-[#121212]">
              Cordialement,
              <br />
              La direction
              <br />
              {school.name}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EnrollmentEmail;
