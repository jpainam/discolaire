import { Img, Section, Text } from "@react-email/components";

//const baseUrl = env.NEXT_PUBLIC_BASE_URL;
const publicUrl = "https://discolaire-public.s3.eu-central-1.amazonaws.com";
export const EmailFooter = () => {
  return (
    <>
      <Section style={{ flexDirection: "row", gap: 4 }}>
        <Img width={300} src={`${publicUrl}/images/google_play.png`} />
        <Img width={300} src={`${publicUrl}/images/app_store.png`} />
      </Section>

      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "rgb(0,0,0, 0.7)",
        }}
      >
        © 2024 | Discolaire Inc., 2257 Burdett Ave, Troy, NY 12180, U.S.A. |
        www.discolaire.com
      </Text>
    </>
  );
};
