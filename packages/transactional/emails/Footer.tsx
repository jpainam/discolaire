import { Img, Link, Section, Text } from "@react-email/components";

export const EmailFooter = () => {
  return (
    <Section style={footerContainer}>
      <Text style={disclaimerStyle}>
        Please do not reply directly to this email. This was sent from an
        address that cannot accept responses. For questions or assistance, visit
        our{" "}
        <Link href="#" style={linkStyle}>
          Help Center
        </Link>
        .
      </Text>
      <Text style={addressStyle}>
        Discolaire LLC, 400 1st Ave., Needham, MA 02494, USA
      </Text>
      <Text style={legalStyle}>
        © 2024 Discolaire Inc. All rights reserved. Discolaire, the Discolaire
        logo, and other trademarks are the property of Discolaire Inc in the US
        and other countries.
      </Text>
      <Section style={linksContainer}>
        <Link href="https://discolaire.com" target="_blank" style={linkStyle}>
          Discolaire
        </Link>{" "}
        |
        <Link href="#" style={linkStyle}>
          Unsubscribe
        </Link>{" "}
        |
        <Link href="#" style={linkStyle}>
          Privacy and Cookies Statement
        </Link>{" "}
        |
        <Link href="#" style={linkStyle}>
          Contact Us
        </Link>
      </Section>
      <Section style={appStoreContainer}>
        <Link href="#">
          <Img
            src="https://discolaire-public.s3.eu-central-1.amazonaws.com/images/app-store-badge.svg"
            alt="App Store"
            width="135"
            height="auto"
            style={storeIconStyle}
          />
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link href="#">
          <Img
            src="https://discolaire-public.s3.eu-central-1.amazonaws.com/images/google-play-badge.svg"
            alt="Google Play"
            width="135"
            height="auto"
            style={storeIconStyle}
          />
        </Link>
      </Section>
      <Section style={socialIconsContainer}>
        <Text style={followTextStyle}>Follow us for updates:</Text>
        <Link href="#">
          <Img
            src="https://react-email-demo-3kjjfblod-resend.vercel.app/static/slack-facebook.png"
            alt="Facebook"
            width="24"
            height="24"
            style={socialIconStyle}
          />
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link href="#">
          <Img
            src="https://react-email-demo-3kjjfblod-resend.vercel.app/static/slack-twitter.png"
            alt="Twitter"
            width="24"
            height="24"
            style={socialIconStyle}
          />
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link href="#">
          <Img
            src="https://react-email-demo-3kjjfblod-resend.vercel.app/static/slack-linkedin.png"
            alt="Instagram"
            width="24"
            height="24"
            style={socialIconStyle}
          />
        </Link>
      </Section>
    </Section>
  );
};

// Styles
const footerContainer = {
  backgroundColor: "#f4f4f4",
  padding: "20px",
  textAlign: "center" as const,
  fontFamily: "Arial, sans-serif",
};

const disclaimerStyle = {
  fontSize: "12px",
  color: "#555555",
  marginBottom: "10px",
};

const addressStyle = {
  fontSize: "12px",
  color: "#555555",
  marginBottom: "10px",
};

const legalStyle = {
  fontSize: "12px",
  color: "#555555",
  marginBottom: "20px",
};

const linksContainer = {
  marginBottom: "20px",
  fontSize: "12px",
};

const linkStyle = {
  color: "#0073bb",
  textDecoration: "none",
  margin: "0 5px",
};

const appStoreContainer = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "20px",
};

const storeIconStyle = {
  display: "inline-block",
};

const socialIconsContainer = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
};

const socialIconStyle = {
  display: "inline-block",
};

const followTextStyle = {
  fontSize: "12px",
  color: "#555555",
  marginBottom: "10px",
};
