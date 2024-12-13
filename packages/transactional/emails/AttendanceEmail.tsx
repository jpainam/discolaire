import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Logo } from "../components/logo";
import { geti18n } from "../locales";
import { getAssetUrl } from "../utils";

interface School {
  logo?: string | null;
  name: string;
  id: string;
}

const assetUrl = getAssetUrl();
const defaultSchool = {
  logo: `${assetUrl}/images/logo-round.png`,
  name: "Institut Polyvalent Wague",
  id: "1",
};

export const AttendanceEmail = ({
  parentName = "Dupont",
  studentName = "Doe John",
  title = "Absence",
  locale = "fr",
  school = defaultSchool,
}: {
  parentName: string;
  studentName: string;
  title: string;
  school: School;
  locale: string;
}) => {
  const { t } = geti18n({ locale });
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{t("attendance")}</Preview>
        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            <Logo logoUrl={school.logo} />
            <Heading className="mx-0 p-0 text-center text-[18px] font-normal text-[#121212]">
              {t("attendance")}
            </Heading>
            <Text className="text-[14px] leading-[24px] text-[#121212]">
              Hello {parentName},
              <br />
              <br />
              Votre eleve, du nom de {studentName} a ete absent aujourd'hui.
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              {title}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AttendanceEmail;
