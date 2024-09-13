// Importaciones necesarias
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import errorHandler from "./src/middleware/errors/errorHeanler";
import indexRoutes from "./src/Routes/indexRoutes";
import User from "./src/model/userModel"; 
import bcrypt from "bcrypt";

const app = express();

dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(helmet());

// Configuración de límite de tasa
const TIMES: number = parseInt(process.env.TIMES || "900000", 10);
const MAX: number = parseInt(process.env.MAX || "100", 10);

app.use(
  rateLimit({
    windowMs: TIMES,
    max: MAX,
  })
);

// Configuración de CORS
const corsOptions = {
  origin: process.env.URL_FRONT,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Configuración de las rutas
app.use("/", indexRoutes);

// Manejo de errores
app.use(errorHandler);

// Función para crear un usuario administrador por defecto
const createAdminUser = async (): Promise<void> => {
  try {
    // Verifica si ya existe un administrador
    const existingAdmin = await User.findOne({ where: { isAdmin: true } });
    if (!existingAdmin) {
      // Crear un nuevo usuario administrador
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        10
      );
      const adminUser = await User.create({
        username: "admin",
        password: hashedPassword, // Usa contraseña hasheada
        email: "admin@example.com",
        isAdmin: true,
      });

      // Mostrar las credenciales del administrador en la consola (solo para desarrollo)
      console.log("Administrador creado por defecto:");
      console.log(`Username: ${adminUser.username}`);
      console.log(`Password: (hasheada)`); // No mostrar la contraseña real
      console.log(`Email: ${adminUser.email}`);
    } else {
      console.log("Ya existe un administrador en el sistema.");
    }
  } catch (error) {
    console.error("Error al crear el usuario administrador:", error);
  }
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Listening on PORT ${PORT}`);
  console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);

  // Llamar a la función para crear el administrador al iniciar el servidor
  await createAdminUser();
});
