import { authEnv } from "../env";

const env = authEnv();

export async function completeRegistration({
  user,
  url,
  baseUrl,
  tenant,
}: {
  user: { id: string; email: string; name: string };
  url: string;
  baseUrl: string;
  tenant: string;
}) {
  if (user.email.includes("@example.com")) {
    console.warn("User email is a placeholder, skipping email sending.");
    return;
  }

  const response = await fetch(`${baseUrl}/api/emails/invitation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.DISCOLAIRE_API_KEY,
    },
    body: JSON.stringify({
      userId: user.id,
      email: user.email,
      name: user.name,
      url: url,
      tenant,
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to send invitation email:", text);
    throw new Error(`Failed to send invitation email: ${text}`);
  }
}

export async function sendResetPassword({
  user,
  url,
  baseUrl,
  tenant,
}: {
  user: { id: string; email: string; name: string };
  url: string;
  baseUrl: string;
  tenant: string;
}) {
  if (user.email.includes("@example.com")) {
    console.warn("User email is a placeholder, skipping email sending.");
    return;
  }

  const response = await fetch(`${baseUrl}/api/emails/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.DISCOLAIRE_API_KEY,
    },
    body: JSON.stringify({
      email: user.email,
      name: user.name,
      url,
      tenant,
    }),
  });

  if (!response.ok) {
    console.error(await response.json());
    throw new Error(`Failed to send reset password email`);
  }
}

export async function sendChangeEmailVerification({
  user,
  newEmail,
  url,
  baseUrl,
  tenant,
}: {
  user: { id: string; email: string; name: string };
  newEmail: string;
  url: string;
  baseUrl: string;
  tenant: string;
}) {
  if (user.email.includes("@example.com")) {
    console.warn("User email is a placeholder, skipping email sending.");
    return;
  }

  const response = await fetch(
    `${baseUrl}/api/emails/change-email-verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.DISCOLAIRE_API_KEY,
      },
      body: JSON.stringify({
        email: user.email,
        newEmail,
        name: user.name,
        url,
        tenant,
      }),
    },
  );

  if (!response.ok) {
    console.error(await response.text());
    throw new Error(`Failed to send change email verification`);
  }
}

export async function sendVerificationEmail({
  user,
  url,
  baseUrl,
  tenant,
}: {
  user: { id: string; email: string; name: string };
  url: string;
  baseUrl: string;
  tenant: string;
}) {
  if (user.email.includes("@example.com")) {
    console.warn("User email is a placeholder, skipping email sending.");
    return;
  }

  const response = await fetch(`${baseUrl}/api/emails/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.DISCOLAIRE_API_KEY,
    },
    body: JSON.stringify({
      email: user.email,
      name: user.name,
      url,
      tenant,
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error(`Failed to send verification email`);
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function sendOrganizationInvitation(_opts: {
  email: string;
  invitedByEmail: string;
  invitedByUsername: string;
  teamName: string;
  inviteLink: string;
}): Promise<true> {
  return true;
}
