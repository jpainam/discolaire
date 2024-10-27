import { isInvitationLinkMatch } from "@repo/lib/encrypt";

export default async function Page(
  props: {
    params: Promise<{ code: string }>;
    searchParams: Promise<{ email: string }>;
  }
) {
  const searchParams = await props.searchParams;

  const {
    email
  } = searchParams;

  const params = await props.params;

  const {
    code
  } = params;

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
