import { env } from "../env";

export async function sendAttendanceEmail(
  id: number,
  type: "absence" | "chatter",
) {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_BASE_URL}/api/emails/attendance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.DISCOLAIRE_API_KEY,
        },
        body: JSON.stringify({ id, type }),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending attendance email:", error);
  }
}
