import {
  Body,
  Container,
  Heading,
  Html,
  Preview,
  Row,
  Section,
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
  termName: string;
  school: School;
  absence: number;
  justifiedAbsence: number;
  late: number;
  justifiedLate: number;
  consigne: number;
  chatter: number;
  exclusion: number;
}

export const QuarterlyAttendanceSummaryEmail = ({
  studentName = "Dupont Pierre",
  classroomName = "6ème A",
  termName = "Trimestre 1",
  school = defaultSchool,
  absence = 2,
  justifiedAbsence = 1,
  late = 3,
  justifiedLate = 0,
  consigne = 1,
  chatter = 4,
  exclusion = 0,
}: Props) => {
  const title = `${studentName}`;

  const rows: { label: string; value: number; sub?: number }[] = [
    { label: "Absences", value: absence, sub: justifiedAbsence },
    { label: "Retards", value: late, sub: justifiedLate },
    { label: "Bavardages", value: chatter },
    { label: "Consignes", value: consigne },
    { label: "Exclusions", value: exclusion },
  ].filter((r) => r.value > 0);

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
              Nous vous adressons ci-dessous le bilan de présence de,{" "}
              <span className="font-semibold">{studentName}</span>, en classe de{" "}
              <span className="font-semibold">{classroomName}</span>, pour le{" "}
              <span className="font-semibold">{termName}</span>.
            </Text>

            <Section
              style={{
                border: "1px solid #E8E7E1",
                borderRadius: 6,
                padding: "0 16px",
                marginBottom: 16,
              }}
            >
              {rows.map((row) => (
                <Row
                  key={row.label}
                  style={{ borderBottom: "1px solid #F0EFE9", padding: "10px 0" }}
                >
                  <td
                    style={{
                      color: "#555",
                      fontSize: 14,
                      width: "60%",
                      paddingRight: 8,
                    }}
                  >
                    {row.label}
                  </td>
                  <td
                    style={{
                      color: "#121212",
                      fontSize: 14,
                      fontWeight: 600,
                      textAlign: "right",
                    }}
                  >
                    {row.value}
                    {row.sub !== undefined && row.sub > 0 && (
                      <span style={{ fontWeight: 400, color: "#888" }}>
                        {" "}
                        (dont {row.sub} justifié{row.sub > 1 ? "s" : ""})
                      </span>
                    )}
                  </td>
                </Row>
              ))}
            </Section>

            <Text className="text-[#121212]">
              Nous vous invitons à prendre connaissance de ces informations et
              restons disponibles pour tout échange à ce sujet.
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

export default QuarterlyAttendanceSummaryEmail;
