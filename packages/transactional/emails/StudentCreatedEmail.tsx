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

interface Parent {
  name: string;
  relationship?: string;
  email?: string;
  phone?: string;
}

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
  studentFirstName: string;
  studentLastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber?: string;
  residence?: string;
  parents: Parent[];
  school: School;
}

export const StudentCreatedEmail = ({
  studentFirstName = "Pierre",
  studentLastName = "Dupont",
  dateOfBirth = "01/01/2010",
  gender = "Masculin",
  phoneNumber = "",
  residence = "",
  parents = [],
  school = defaultSchool,
}: Props) => {
  const studentName = `${studentFirstName} ${studentLastName}`;
  const previewText = `Inscription de ${studentName} enregistrée`;

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
              Nous accusons bonne réception de votre dossier et avons le plaisir
              de vous confirmer que les informations concernant{" "}
              <span className="font-semibold">{studentName}</span> ont bien été
              enregistrées dans notre système.
            </Text>

            <Section className="my-4 rounded-md border border-[#E8E7E1] bg-[#f9f9f9] p-4">
              <Heading className="mb-2 text-[14px] font-semibold text-[#121212]">
                Informations de l'élève
              </Heading>
              <Row>
                <Column className="w-1/2 py-1">
                  <Text className="m-0 text-[12px] text-[#6b7280]">Nom</Text>
                  <Text className="m-0 text-[14px] font-medium text-[#121212]">
                    {studentLastName}
                  </Text>
                </Column>
                <Column className="w-1/2 py-1">
                  <Text className="m-0 text-[12px] text-[#6b7280]">Prénom</Text>
                  <Text className="m-0 text-[14px] font-medium text-[#121212]">
                    {studentFirstName}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="w-1/2 py-1">
                  <Text className="m-0 text-[12px] text-[#6b7280]">
                    Date de naissance
                  </Text>
                  <Text className="m-0 text-[14px] font-medium text-[#121212]">
                    {dateOfBirth}
                  </Text>
                </Column>
                <Column className="w-1/2 py-1">
                  <Text className="m-0 text-[12px] text-[#6b7280]">Genre</Text>
                  <Text className="m-0 text-[14px] font-medium text-[#121212]">
                    {gender}
                  </Text>
                </Column>
              </Row>
              {phoneNumber && (
                <Row>
                  {phoneNumber && (
                    <Column className="w-1/2 py-1">
                      <Text className="m-0 text-[12px] text-[#6b7280]">
                        Téléphone
                      </Text>
                      <Text className="m-0 text-[14px] font-medium text-[#121212]">
                        {phoneNumber}
                      </Text>
                    </Column>
                  )}
                  {residence && (
                    <Column className="w-1/2 py-1">
                      <Text className="m-0 text-[12px] text-[#6b7280]">
                        Adresse
                      </Text>
                      <Text className="m-0 text-[14px] font-medium text-[#121212]">
                        {residence}
                      </Text>
                    </Column>
                  )}
                </Row>
              )}
            </Section>

            {parents.length > 0 && (
              <Section className="my-4">
                <Heading className="mb-2 text-[14px] font-semibold text-[#121212]">
                  Parents / Tuteurs ({parents.length})
                </Heading>
                {parents.map((parent, index) => (
                  <Row
                    key={index}
                    className="mb-2 rounded-md border border-[#E8E7E1] bg-[#f9f9f9] p-3"
                  >
                    <Column>
                      <Text className="m-0 text-[14px] font-medium text-[#121212]">
                        {parent.name}
                        {parent.relationship && (
                          <span className="ml-2 text-[12px] font-normal text-[#6b7280]">
                            ({parent.relationship})
                          </span>
                        )}
                      </Text>
                      {parent.email && (
                        <Text className="m-0 text-[12px] text-[#6b7280]">
                          {parent.email}
                        </Text>
                      )}
                      {parent.phone && (
                        <Text className="m-0 text-[12px] text-[#6b7280]">
                          {parent.phone}
                        </Text>
                      )}
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            <Section className="my-4 rounded-md border border-[#fef3c7] bg-[#fffbeb] p-4">
              <Text className="m-0 text-[13px] text-[#92400e]">
                <span className="font-semibold">Prochaine étape :</span>{" "}
                L'affectation de {studentFirstName} dans une classe sera
                effectuée après la validation du paiement des frais de
                scolarité.
              </Text>
            </Section>

            <Text className="text-[#121212]">
              Pour toute question, n'hésitez pas à prendre contact avec notre
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

export default StudentCreatedEmail;
