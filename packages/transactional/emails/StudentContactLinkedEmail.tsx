import {
  Body,
  Column,
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

const defaultSchool: School = {
  logo: `logo-round.png`,
  name: "Institut Polyvalent Wague",
  id: "1",
};

interface Props {
  studentName: string;
  contactName: string;
  relationshipName?: string;
  school: School;
}

export const StudentContactLinkedEmail = ({
  studentName = "Pierre Dupont",
  contactName = "Marie Dupont",
  relationshipName = undefined,
  school = defaultSchool,
}: Props) => {
  const previewText = `Vous avez été associé(e) à ${studentName}`;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{previewText}</Preview>

        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo logoUrl={school.logo} />

            <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
              Madame / Monsieur,
            </Heading>

            <br />

            <Text className="text-[#121212]">
              Nous vous informons que votre profil a été associé au dossier de
              l'élève <span className="font-semibold">{studentName}</span>
              {relationshipName ? (
                <>
                  {" "}
                  en tant que{" "}
                  <span className="font-semibold">{relationshipName}</span>
                </>
              ) : null}{" "}
              au sein de <span className="font-semibold">{school.name}</span>.
            </Text>

            <Section className="my-4 rounded-md border border-[#E8E7E1] bg-[#f9f9f9] p-4">
              <Heading className="mb-2 text-[14px] font-semibold text-[#121212]">
                Récapitulatif
              </Heading>
              <Row>
                <Column className="w-1/2 py-1">
                  <Text className="m-0 text-[12px] text-[#6b7280]">Élève</Text>
                  <Text className="m-0 text-[14px] font-medium text-[#121212]">
                    {studentName}
                  </Text>
                </Column>
                <Column className="w-1/2 py-1">
                  <Text className="m-0 text-[12px] text-[#6b7280]">
                    Contact
                  </Text>
                  <Text className="m-0 text-[14px] font-medium text-[#121212]">
                    {contactName}
                  </Text>
                </Column>
              </Row>
              {relationshipName ? (
                <Row>
                  <Column className="py-1">
                    <Text className="m-0 text-[12px] text-[#6b7280]">
                      Lien de parenté
                    </Text>
                    <Text className="m-0 text-[14px] font-medium text-[#121212]">
                      {relationshipName}
                    </Text>
                  </Column>
                </Row>
              ) : null}
            </Section>

            <Text className="text-[#121212]">
              Vous recevrez désormais les communications relatives à cet élève.
              Pour toute question, n'hésitez pas à contacter notre
              administration.
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

export default StudentContactLinkedEmail;
