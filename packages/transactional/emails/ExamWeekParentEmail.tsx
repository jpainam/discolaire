import {
  Body,
  Container,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Head } from "../components/Head";
import { Logo } from "../components/logo";

interface School {
  logo?: string | null;
  name: string;
}

interface Props {
  parentName: string;
  studentName: string;
  termName: string;
  examStartDate: Date;
  examEndDate: Date | null;
  school: School;
}

const defaultSchool: School = {
  logo: "logo-round.png",
  name: "Institut Polyvalent Wague",
};

export const ExamWeekParentEmail = ({
  parentName = "Madame Dupont",
  studentName = "Pierre Dupont",
  termName = "Trimestre 2",
  examStartDate = new Date(),
  examEndDate = null,
  school = defaultSchool,
}: Props) => {
  const formatDate = (d: Date) =>
    format(d, "EEEE d MMMM yyyy", { locale: fr });

  const examPeriod = examEndDate
    ? `du ${formatDate(examStartDate)} au ${formatDate(examEndDate)}`
    : `le ${formatDate(examStartDate)}`;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>
          Rappel : les examens de {studentName} débutent la semaine prochaine
        </Preview>

        <Body className="mx-auto my-auto bg-[#f6f7fb] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[10px] bg-white p-[24px]"
            style={{ borderStyle: "solid", borderWidth: 1, borderColor: "#E8E7E1" }}
          >
            <Logo logoUrl={school.logo} />

            <Heading className="mx-0 mt-[16px] p-0 text-[20px] font-semibold text-[#101828]">
              Semaine d'examens — {termName}
            </Heading>

            <Text className="mt-[8px] mb-0 text-[14px] text-[#475467]">
              Cher(e) <span className="font-semibold">{parentName}</span>,
            </Text>

            <Text className="mt-[4px] mb-[16px] text-[14px] text-[#475467]">
              Nous vous informons que les examens du{" "}
              <span className="font-semibold">{termName}</span> pour votre
              enfant <span className="font-semibold">{studentName}</span> sont
              programmés <span className="font-semibold">{examPeriod}</span>.
            </Text>

            <Section
              className="rounded-[8px] bg-[#f0f9ff] px-[16px] py-[14px]"
              style={{ borderLeft: "4px solid #0ea5e9" }}
            >
              <Text className="m-0 text-[13px] font-semibold text-[#075985]">
                Période d'examens
              </Text>
              <Text className="m-0 mt-[4px] text-[13px] text-[#0c4a6e]">
                {examPeriod.charAt(0).toUpperCase() + examPeriod.slice(1)}
              </Text>
            </Section>

            <Text className="mt-[16px] mb-[8px] text-[14px] text-[#475467]">
              Nous vous encourageons à soutenir votre enfant dans sa
              préparation. En cas de question, n'hésitez pas à contacter
              l'établissement.
            </Text>

            <Hr className="my-[20px] border-[#eaecf0]" />

            <Text className="m-0 text-[13px] text-[#475467]">
              Cordialement,
              <br />
              La direction
              <br />
              {school.name}
            </Text>

            <Text className="mt-[16px] mb-0 text-[11px] text-[#98a2b3]">
              Cet e-mail est généré automatiquement. Ne pas répondre à ce
              message.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ExamWeekParentEmail;
