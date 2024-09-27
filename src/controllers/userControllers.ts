import { Request, Response, NextFunction } from "express";
import User from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "Fetched all users", users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "Fetched user by ID", user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      username,
      password,
      isAdmin = false,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    } = req.body;

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10); // Cambia a User.hashPassword si tienes un método específico

    // Crear un nuevo usuario con la contraseña encriptada
    const user = await User.create({
      username,
      password: hashedPassword,
      isAdmin,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      username,
      password,
      isAdmin,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    } = req.body;

    const updates: any = {
      username,
      isAdmin,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    };

    if (password) {
      // Encriptar la nueva contraseña si se proporciona
      updates.password = await bcrypt.hash(password, 10); // Cambia a User.hashPassword si tienes un método específico
    }

    // Actualizar el usuario
    const [updated] = await User.update(updates, { where: { id } });

    if (updated) {
      const updatedUser = await User.findByPk(id);
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son obligatorios" });
  }

  try {
    console.log("Email recibido:", email);
    console.log("Contraseña recibida:", password);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    console.log("Usuario encontrado:", user.username);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("La contraseña no coincide");
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar el token
    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Enviar la respuesta solo una vez
    return res.status(200).json({
      token,
      userId: user.id,
      userRole: user.isAdmin ? "admin" : "user",
    });
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    return res.status(500).json({
      message: "Error del servidor",
      error: (error as Error).message,
    });
  }
};


export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isAdmin = false,
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Cambia a User.hashPassword si tienes un método específico

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isAdmin,
    });

    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error registrando el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
