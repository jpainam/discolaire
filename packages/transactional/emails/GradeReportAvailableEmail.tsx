import {
  Body,
  Button,
  Column,
  Container,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
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
  resultPublishedAt: Date;
  school: School;
  appUrl?: string;
}

const defaultSchool: School = {
  logo: "logo-round.png",
  name: "Institut Polyvalent Wague",
};

export const GradeReportAvailableEmail = ({
  parentName = "Madame Dupont",
  studentName = "Pierre Dupont",
  termName = "Trimestre 2",
  resultPublishedAt = new Date(),
  school = defaultSchool,
  appUrl = "https://discolaire.com",
}: Props) => {
  const publishedDate = format(resultPublishedAt, "d MMMM yyyy", {
    locale: fr,
  });

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>
          Le bulletin de notes de {studentName} pour le {termName} est
          disponible
        </Preview>

        <Body className="mx-auto my-auto bg-[#f6f7fb] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] rounded-[10px] bg-white p-[24px]"
            style={{
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#E8E7E1",
            }}
          >
            <Logo logoUrl={school.logo} />

            <Heading className="mx-0 mt-[16px] p-0 text-[20px] font-semibold text-[#101828]">
              Bulletin de notes disponible
            </Heading>

            <Text className="mt-[8px] mb-0 text-[14px] text-[#475467]">
              Cher(e) <span className="font-semibold">{parentName}</span>,
            </Text>

            <Text className="mt-[4px] mb-[16px] text-[14px] text-[#475467]">
              Nous avons le plaisir de vous informer que le bulletin de notes de{" "}
              <span className="font-semibold">{studentName}</span> pour le{" "}
              <span className="font-semibold">{termName}</span> est désormais
              disponible depuis le{" "}
              <span className="font-semibold">{publishedDate}</span>.
            </Text>

            <Section
              className="rounded-[8px] bg-[#f0fdf4] px-[16px] py-[14px]"
              style={{ borderLeft: "4px solid #22c55e" }}
            >
              <Text className="m-0 text-[13px] font-semibold text-[#166534]">
                Bulletin disponible
              </Text>
              <Text className="m-0 mt-[4px] text-[13px] text-[#15803d]">
                {termName} — {studentName}
              </Text>
              <Text className="m-0 mt-[2px] text-[12px] text-[#16a34a]">
                Publié le {publishedDate}
              </Text>
            </Section>

            <Text className="mt-[16px] mb-[8px] text-[14px] text-[#475467]">
              Vous pouvez consulter le bulletin de notes de votre enfant en vous
              connectant à votre espace parent sur l'application Discolaire.
            </Text>

            <Section className="mt-[24px] mb-[24px]">
              <Row>
                <Column align="center">
                  <Button
                    href={appUrl}
                    className="box-border rounded-[8px] bg-[#007bff] px-[32px] py-[12px] text-[14px] font-medium text-white no-underline"
                  >
                    Voir le bulletin
                  </Button>
                </Column>
              </Row>
            </Section>

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

export default GradeReportAvailableEmail;
