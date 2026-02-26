import {
  Body,
  Container,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Head } from "../components/Head";
import { Logo } from "../components/logo";

interface School {
  logo?: string | null;
  name: string;
}

const defaultSchool: School = {
  logo: "logo-round.png",
  name: "Institut Polyvalent Wague",
};

interface Props {
  studentName: string;
  parentName?: string;
  gradeSheetName: string;
  courseName: string;
  classroomName: string;
  termName: string;
  scale: number;
  grade?: number;
  isAbsent?: boolean;
  school?: School;
}

export const GradeCreatedEmail = ({
  studentName = "Dupont Pierre",
  parentName,
  gradeSheetName = "Devoir 1",
  courseName = "Mathématiques",
  classroomName = "6ème A",
  termName = "Trimestre 1",
  scale = 20,
  grade = 15,
  isAbsent = false,
  school = defaultSchool,
}: Props) => {
  const preview = `Nouvelles notes disponibles – ${courseName} – ${gradeSheetName}`;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{preview}</Preview>

        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo logoUrl={school.logo} />

            <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
              {parentName
                ? `Madame / Monsieur ${parentName}`
                : "Madame / Monsieur"}
            </Heading>

            <br />

            <Text className="text-[#121212]">
              Nous vous informons que les notes de{" "}
              <span className="font-semibold">{gradeSheetName}</span> ont été
              saisies pour votre enfant{" "}
              <span className="font-semibold">{studentName}</span>.
            </Text>

            <Section className="my-[16px] rounded-[6px] bg-[#f5f5f5] p-[16px]">
              <Text className="m-0 text-[#121212]">
                <span className="font-semibold">Classe :</span> {classroomName}
              </Text>
              <Text className="m-0 text-[#121212]">
                <span className="font-semibold">Matière :</span> {courseName}
              </Text>
              <Text className="m-0 text-[#121212]">
                <span className="font-semibold">Période :</span> {termName}
              </Text>
              <Text className="m-0 text-[#121212]">
                <span className="font-semibold">Note obtenue :</span>{" "}
                {isAbsent ? (
                  <span style={{ color: "#b45309" }}>Absent(e)</span>
                ) : (
                  <span className="font-semibold">
                    {grade}/{scale}
                  </span>
                )}
              </Text>
            </Section>

            <Text className="text-[#121212]">
              Vous pouvez consulter le détail des notes en vous connectant à
              l'espace parent sur la plateforme Discolaire.
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

export default GradeCreatedEmail;
