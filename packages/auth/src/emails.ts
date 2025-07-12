import { authEnv } from "../env";

const env = authEnv();
export async function completeRegistration({
  user,
  url,
}: {
  user: { id: string; email: string; name: string };
  url: string;
}) {
  if (user.email.includes("@example.com")) {
    console.warn("User email is a placeholder, skipping email sending.");
    return;
  }

  const response = await fetch(
    `${env.NEXT_PUBLIC_BASE_URL}/api/emails/invitations`,
    {
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
    },
  );
  if (!response.ok) {
    const error = (await response.json()) as Error;
    console.error(error);
    throw new Error(`Failed to send invitation email: ${error.message}`);
  }
}

export async function sendResetPassword({
  user,
  url,
}: {
  user: { id: string; email: string; name: string };
  url: string;
}) {
  if (user.email.includes("@example.com")) {
    console.warn("User email is a placeholder, skipping email sending.");
    return;
  }

  const response = await fetch(
    `${env.NEXT_PUBLIC_BASE_URL}/api/emails/invitations`,
    {
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
    },
  );
  if (!response.ok) {
    const error = (await response.json()) as Error;
    console.error(error);
    throw new Error(`Failed to send invitation email: ${error.message}`);
  }
}
