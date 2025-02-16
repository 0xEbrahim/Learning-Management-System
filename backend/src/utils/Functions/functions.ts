import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, 12);
  return hashed;
};

export const comparePassword = async (password: string, hashed: string) => {
  return await bcrypt.compare(password, hashed);
};
