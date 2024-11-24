import { Hr, Row, Section, Text } from "@react-email/components";

//const publicUrl = getAssetUrl();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Footer = ({ locale }: { locale: string }) => {
  //const { t } = geti18n({ locale });
  return (
    <Section className="w-full">
      <Hr />
      {/* <Text className="text-[#B8B8B8]">{t("footer.slogan")}</Text> */}

      {/* <Row>
        <Img
          width="45"
          height="45"
          alt="Google"
          className="mx-auto my-0 block"
          src={`${publicUrl}/images/google_play.png`}
        />
        <Img
          width="45"
          height="45"
          alt="Apple"
          className="mx-auto my-0 block"
          src={`${publicUrl}/images/app_store.png`}
        />
      </Row> */}
      <Row>
        <Text className="text-xs text-[#B8B8B8]">
          © 2024 | Discolaire Inc. Troy, NY 12180, U.S.A. |{" "}
          <a href="https://www.discolaire.com" target="_blank">
            www.discolaire.com
          </a>
        </Text>
      </Row>
    </Section>
  );
};
