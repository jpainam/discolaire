import { Hr, Img, Row, Section, Text } from "@react-email/components";

import type { SupportedLocale } from "../locales";
import { geti18n } from "../locales";
import { getAssetUrl } from "../utils";

const publicUrl = getAssetUrl();
export const Footer = ({ locale }: { locale: SupportedLocale }) => {
  const { t } = geti18n({ locale });
  return (
    <Section className="w-full">
      <Hr />

      <Text className="font-regular text-[21px]">{t("footer.slogan")}</Text>
      <Row>
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
      </Row>
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
