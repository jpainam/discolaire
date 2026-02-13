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

interface TimetableSlot {
  title: string;
  dayLabel: string;
  startTime: string;
  endTime: string;
  description?: string;
  teacherName?: string | null;
  location?: string;
}

interface ClassroomTimetableEmailProps {
  schoolName: string;
  classroomName: string;
  recipientName?: string;
  timetable: TimetableSlot[];
}

export function ClassroomTimetableEmail({
  schoolName,
  classroomName,
  recipientName,
  timetable,
}: ClassroomTimetableEmailProps) {
  return (
    <Html>
      <Preview>Emploi du temps - {classroomName}</Preview>
      <Tailwind>
        <Body className="bg-[#f6f7fb] py-[24px] font-sans">
          <Container className="mx-auto max-w-[640px] rounded-[10px] bg-white p-[24px]">
            <Heading className="m-0 text-[22px] text-[#101828]">
              Emploi du temps de {classroomName}
            </Heading>

            <Text className="mt-[12px] mb-[8px] text-[15px] text-[#344054]">
              {recipientName ? `Bonjour ${recipientName},` : "Bonjour,"}
            </Text>
            <Text className="m-0 text-[14px] text-[#475467]">
              Voici le planning de la classe <b>{classroomName}</b>.
            </Text>

            <Hr className="my-[20px] border-[#eaecf0]" />

            {timetable.map((slot, index) => {
              return (
                <Section
                  key={`${slot.title}-${slot.dayLabel}-${slot.startTime}-${index}`}
                  className="mb-[12px] rounded-[8px] border border-solid border-[#eaecf0] px-[14px] py-[12px]"
                >
                  <Text className="m-0 text-[13px] font-semibold text-[#667085] uppercase">
                    {slot.dayLabel}
                  </Text>
                  <Text className="m-0 mt-[6px] text-[16px] font-semibold text-[#101828]">
                    {slot.title}
                  </Text>
                  <Text className="m-0 mt-[4px] text-[14px] text-[#475467]">
                    {slot.startTime} - {slot.endTime}
                  </Text>
                  {slot.teacherName ? (
                    <Text className="m-0 mt-[4px] text-[14px] text-[#475467]">
                      Enseignant: {slot.teacherName}
                    </Text>
                  ) : null}
                  {slot.location ? (
                    <Text className="m-0 mt-[4px] text-[14px] text-[#475467]">
                      Salle: {slot.location}
                    </Text>
                  ) : null}
                  {slot.description ? (
                    <Text className="m-0 mt-[4px] text-[14px] text-[#475467]">
                      {slot.description}
                    </Text>
                  ) : null}
                </Section>
              );
            })}

            <Text className="mt-[20px] mb-0 text-[12px] text-[#98a2b3]">
              Envoyé par {schoolName}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default ClassroomTimetableEmail;
