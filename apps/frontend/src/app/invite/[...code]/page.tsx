import { isInvitationLinkMatch } from "@repo/lib/encrypt";

export default async function Page({
  params: { code },
  searchParams: { email },
}: {
  params: { code: string };
  searchParams: { email: string };
}) {
  const isMatch = await isInvitationLinkMatch(decodeURIComponent(code), email);

  return (
    <div>
      <h1>Invite</h1>
      <p>
        Invite code: {decodeURIComponent(code)} - is Match{" "}
        {JSON.stringify(isMatch)}
        with this email {email}
      </p>
      <p>Verify the invitation, and send to renew page if successd.</p>
    </div>
  );
}
