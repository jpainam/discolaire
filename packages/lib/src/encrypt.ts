import bcrypt from "bcryptjs";

export const getInvitationCode = async (email: string) => {
  const INVITATION_LINK_SECRET = crypto.randomUUID();
  const encryptedCode = await bcrypt.hash(email + INVITATION_LINK_SECRET, 8);
  console.log("Encrypted code: ", encryptedCode);
  const code = crypto.randomUUID();
  return code.slice(0, 4);
};

export const isInvitationLinkMatch = async (
  invitationCode: string,
  email: string,
) => {
  const INVITATION_LINK_SECRET = crypto.randomUUID();
  const isMatch = await bcrypt.compare(
    email + INVITATION_LINK_SECRET,
    invitationCode,
  );
  return isMatch;
};
