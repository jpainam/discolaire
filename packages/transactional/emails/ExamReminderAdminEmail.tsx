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
  termName: string;
  examStartDate: Date;
  examEndDate: Date | null;
  school: School;
}

const defaultSchool: School = {
  logo: "logo-round.png",
  name: "Institut Polyvalent Wague",
};

export const ExamReminderAdminEmail = ({
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
          Rappel : les examens du {termName} sont prévus la semaine prochaine
        </Preview>

        <Body className="mx-auto my-auto bg-[#f6f7fb] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[10px] bg-white p-[24px]"
            style={{ borderStyle: "solid", borderWidth: 1, borderColor: "#E8E7E1" }}
          >
            <Logo logoUrl={school.logo} />

            <Heading className="mx-0 mt-[16px] p-0 text-[20px] font-semibold text-[#101828]">
              Rappel — Examens la semaine prochaine
            </Heading>

            <Text className="mt-[8px] mb-0 text-[14px] text-[#475467]">
              Bonjour,
            </Text>

            <Text className="mt-[4px] mb-[16px] text-[14px] text-[#475467]">
              Ceci est un rappel automatique : les examens du{" "}
              <span className="font-semibold">{termName}</span> sont programmés{" "}
              <span className="font-semibold">{examPeriod}</span>.
            </Text>

            <Section className="rounded-[8px] bg-[#fffbeb] px-[16px] py-[14px]" style={{ borderLeft: "4px solid #f59e0b" }}>
              <Text className="m-0 text-[13px] font-semibold text-[#92400e]">
                Action requise avant vendredi
              </Text>
              <Text className="m-0 mt-[6px] text-[13px] text-[#78350f]">
                Un email sera automatiquement envoyé à tous les parents{" "}
                <span className="font-semibold">ce vendredi</span> pour les
                prévenir de la semaine d'examens. Si les dates ont été modifiées
                ou si vous souhaitez annuler cet envoi, veuillez effectuer les
                corrections nécessaires avant vendredi.
              </Text>
            </Section>

            <Hr className="my-[20px] border-[#eaecf0]" />

            <Text className="m-0 text-[13px] text-[#475467]">
              Cordialement,
              <br />
              Le système Discolaire
              <br />
              {school.name}
            </Text>

            <Text className="mt-[16px] mb-0 text-[11px] text-[#98a2b3]">
              Cet e-mail est généré automatiquement chaque mercredi. Ne pas
              répondre à ce message.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ExamReminderAdminEmail;
