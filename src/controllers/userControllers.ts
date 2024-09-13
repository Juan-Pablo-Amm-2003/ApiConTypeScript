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
    const hashedPassword = await User.hashPassword(password);

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
      updates.password = await User.hashPassword(password);
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

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.isAdmin ? "admin" : "user" }, // Incluye el rol en el payload
      JWT_SECRET, // Secreto para firmar el token
      { expiresIn: "1h" } // Opcional: tiempo de expiración del token
    );

    // Incluir el `id` y el `role` del usuario en la respuesta
    res
      .status(200)
      .json({
        message: "Login successful",
        token,
        id: user.id,
        role: user.isAdmin ? "admin" : "user",
      });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
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
      isAdmin = false, // Asigna un valor por defecto si no se proporciona
    } = req.body;

    // Asegúrate de que todos los campos obligatorios se están manejando correctamente
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Encriptar la contraseña
    const hashedPassword = await User.hashPassword(password);

    // Crear el nuevo usuario
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

    // Responder con éxito
    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        // No incluir la contraseña en la respuesta
      },
    });
  } catch (error) {
    console.error("Error registrando el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
