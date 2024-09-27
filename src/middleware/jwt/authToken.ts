import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";

// Interface extendida para incluir el usuario autenticado
interface UserRequest extends Request {
  user?: { id: number; email: string; isAdmin: boolean };
}

// Middleware para autenticar el token
export const authenticateToken = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token no válido" });
    }

    const { id, email, role } = decoded as {
      id: number;
      email: string;
      role: string;
    };
    req.user = { id, email, isAdmin: role === "admin" }; // Verifica si el role es 'admin'
    next();
  });
};

// Middleware para verificar si es admin
export const isAdmin = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return res
      .status(403)
      .json({ message: "Acceso denegado, no eres administrador" });
  }
  next();
};
