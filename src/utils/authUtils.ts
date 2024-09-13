import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";


export const createToken = (userId: number | string, role: string) => {
  const id = userId.toString(); 

  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1h" });
};

