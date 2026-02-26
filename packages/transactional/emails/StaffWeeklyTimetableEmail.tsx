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

import { Head } from "../components/Head";
import { Logo } from "../components/logo";

interface School {
  logo?: string | null;
  name: string;
}

interface TimetableSlot {
  courseName: string;
  classroomName: string;
  startTime: string;
  endTime: string;
}

interface DaySlots {
  /** e.g. "Lundi 3 mars" */
  dayLabel: string;
  slots: TimetableSlot[];
}

interface Props {
  staffName: string;
  school: School;
  weekLabel: string; // e.g. "du 3 au 7 mars 2025"
  days: DaySlots[];
}

const defaultSchool: School = {
  logo: "logo-round.png",
  name: "Institut Polyvalent Wague",
};

export const StaffWeeklyTimetableEmail = ({
  staffName = "M. Dupont",
  weekLabel = "du 3 au 7 mars 2025",
  school = defaultSchool,
  days = [
    {
      dayLabel: "Lundi 3 mars",
      slots: [
        {
          courseName: "Mathématiques",
          classroomName: "6ème A",
          startTime: "08:00",
          endTime: "09:00",
        },
        {
          courseName: "Mathématiques",
          classroomName: "5ème B",
          startTime: "10:00",
          endTime: "11:00",
        },
      ],
    },
    {
      dayLabel: "Mercredi 5 mars",
      slots: [
        {
          courseName: "Mathématiques",
          classroomName: "4ème A",
          startTime: "14:00",
          endTime: "15:00",
        },
      ],
    },
  ],
}: Props) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>
          Emploi du temps – semaine {weekLabel}
        </Preview>

        <Body className="mx-auto my-auto bg-[#f6f7fb] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[10px] bg-white p-[24px]"
            style={{ borderStyle: "solid", borderWidth: 1, borderColor: "#E8E7E1" }}
          >
            <Logo logoUrl={school.logo} />

            <Heading className="mx-0 mt-[16px] p-0 text-[20px] font-semibold text-[#101828]">
              Votre emploi du temps
            </Heading>

            <Text className="mt-[8px] mb-0 text-[14px] text-[#475467]">
              Bonjour <span className="font-semibold">{staffName}</span>,
            </Text>
            <Text className="mt-[4px] mb-0 text-[14px] text-[#475467]">
              Voici votre planning pour la semaine{" "}
              <span className="font-semibold">{weekLabel}</span>.
            </Text>

            <Hr className="my-[20px] border-[#eaecf0]" />

            {days.map((day) => (
              <Section key={day.dayLabel} className="mb-[20px]">
                <Text className="m-0 mb-[8px] text-[13px] font-semibold uppercase tracking-wide text-[#667085]">
                  {day.dayLabel}
                </Text>

                {day.slots.map((slot, i) => (
                  <Section
                    key={`${day.dayLabel}-${i}`}
                    className="mb-[8px] rounded-[8px] border border-solid border-[#eaecf0] px-[14px] py-[10px]"
                  >
                    <Text className="m-0 text-[15px] font-semibold text-[#101828]">
                      {slot.courseName}
                    </Text>
                    <Text className="m-0 mt-[2px] text-[13px] text-[#475467]">
                      {slot.startTime} – {slot.endTime} &nbsp;·&nbsp; {slot.classroomName}
                    </Text>
                  </Section>
                ))}
              </Section>
            ))}

            <Hr className="my-[20px] border-[#eaecf0]" />

            <Text className="m-0 text-[13px] text-[#475467]">
              Cordialement,
              <br />
              La direction
              <br />
              {school.name}
            </Text>

            <Text className="mt-[16px] mb-0 text-[11px] text-[#98a2b3]">
              Cet e-mail est généré automatiquement chaque vendredi. Ne pas
              répondre à ce message.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default StaffWeeklyTimetableEmail;
