import { Request, Response, NextFunction } from "express";
import User from "../model/userModel";
import { createToken } from "../utils/authUtils";

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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = createToken(user.id.toString());
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await User.hashPassword(password);

    const newUser = await User.create({
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

    const token = createToken(newUser.id.toString());

    res
      .status(201)
      .json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
    next(error);
  }
};
