import bcrypt from "bcryptjs";

export const isPasswordMatch = async (
  password: string,
  userPassword: string,
) => {
  return bcrypt.compare(password, userPassword);
};

export const encryptPassword = async (password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 8);
  return encryptedPassword;
};
const INVITATION_LINK_SECRET = crypto.randomUUID();
export const getInvitationCode = async (email: string) => {
  const encryptedCode = await bcrypt.hash(email + INVITATION_LINK_SECRET, 8);
  console.log("Encrypted code: ", encryptedCode);
  const code = crypto.randomUUID();
  return code.slice(0, 4);
};

export const isInvitationLinkMatch = async (
  invitationCode: string,
  email: string,
) => {
  const isMatch = await bcrypt.compare(
    email + INVITATION_LINK_SECRET,
    invitationCode,
  );
  return isMatch;
};
