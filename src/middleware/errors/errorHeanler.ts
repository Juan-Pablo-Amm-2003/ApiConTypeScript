import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

interface ErrorMessages {
  [key: string]: { status: number; message: string };
}

const errorMessages: ErrorMessages = {
  "User not found": { status: 404, message: "Usuario no encontrado" },
  "Incorrect password": { status: 401, message: "Contraseña incorrecta" },
  "ID is required": { status: 400, message: "Se requiere ID" },
  "That username already exists": {
    status: 400,
    message: "Ese nombre de usuario ya existe",
  },
  "Email is required": {
    status: 400,
    message: "Se requiere correo electrónico",
  },
  "That email already exists": {
    status: 409,
    message: "Ese correo electrónico ya existe",
  },
  "Error logging out": { status: 500, message: "Error al cerrar sesión" },
  Unauthorized: { status: 401, message: "No autorizado" },
  "Product not found": { status: 404, message: "Producto no encontrado" },
  "Invalid credentials": { status: 401, message: "Credenciales inválidas" },
};

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err instanceof Error ? err.stack : "Error desconocido");

  if (err instanceof Error && err.message.startsWith("Validation failed")) {
    // Manejar errores de validación específicos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((error) => error.msg);
      res
        .status(400)
        .json({ message: "Falló la validación", errors: validationErrors });
      return;
    }
  }

  if (err instanceof Error) {
    // Error genérico
    const errorMessage = err.message;
    const errorResponse = errorMessages[errorMessage] || {
      status: 500,
      message: "Error interno del servidor",
    };

    res.status(errorResponse.status).json({ message: errorResponse.message });
    return;
  }

  // Caso en el que no se pueda identificar el error
  res.status(500).json({ message: "Error interno del servidor" });
};

export default errorHandler;
