import { Container, Link, Text } from "@react-email/components";

//const publicUrl = getAssetUrl();

export const Footer = () => {
  return (
    <Container className="mx-auto mt-[32px] max-w-[600px] text-center">
      <Text className="m-0 text-[12px] text-[#666666]">
        Discolaire, Inc. • 3710 El Camino Real, Santa Clara, CA 95051
      </Text>
      <Text className="m-0 mt-[8px] text-[12px] text-[#666666]">
        <Link href="#" className="text-[#666666] underline">
          Unsubscribe
        </Link>{" "}
        {/* • © {new Date().getFullYear()} Discolaire, Inc. */}
      </Text>
    </Container>
  );
};
