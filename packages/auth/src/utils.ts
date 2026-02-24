import { authEnv } from "../env";

const env = authEnv();

export async function completeRegistration({
  user,
  url,
  baseUrl,
}: {
  user: { id: string; email: string; name: string };
  url: string;
  baseUrl: string;
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
    }),
  });
  if (!response.ok) {
    const error = (await response.json()) as Error;
    console.error(error);
    throw new Error(`Failed to send invitation email: ${error.message}`);
  }
}

export async function sendResetPassword({
  user,
  url,
  baseUrl,
}: {
  user: { id: string; email: string; name: string };
  url: string;
  baseUrl: string;
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
    body: JSON.stringify({ email: user.email, name: user.name, url }),
  });

  if (!response.ok) {
    console.error(await response.json());
    throw new Error(`Failed to send reset password email`);
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
