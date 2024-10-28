import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

//import { EmailFooter } from "./Footer";

export function ResetPassword({
  username,
  resetLink,
}: {
  username: string;
  resetLink: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Reset Request</Heading>
          <Text style={text}>Hello {username},</Text>
          <Text style={text}>
            We received a request to reset your password. If you didn't make
            this request, you can safely ignore this email.
          </Text>
          <Section style={buttonContainer}>
            <Button
              style={{
                ...button,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 12,
                paddingBottom: 12,
              }}
              href={resetLink}
            >
              Reset Your Password
            </Button>
          </Section>
          <Text style={text}>
            If the button doesn't work, copy and paste this link into your
            browser:
          </Text>
          <Link href={resetLink} style={link}>
            {resetLink}
          </Link>
          <Text style={text}>
            This link will expire in 24 hours. If you need assistance, please
            contact our support team.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#007bff",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const link = {
  color: "#007bff",
  textDecoration: "underline",
};
