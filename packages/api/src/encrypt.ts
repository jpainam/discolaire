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

const INVITATION_LINK_SECRET = `${process.env.INVITATION_LINK_SECRET}`;
export const encryptInvitationCode = async (email: string) => {
  const encryptedCode = await bcrypt.hash(email + INVITATION_LINK_SECRET, 8);
  return encryptedCode;
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
