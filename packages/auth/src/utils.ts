import bcrypt from "bcryptjs";

export const isPasswordMatch = async (
  password: string,
  userPassword: string,
) => {
  return bcrypt.compare(password, userPassword);
};
