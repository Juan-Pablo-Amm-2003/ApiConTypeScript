import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
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
const TIMES = parseInt(process.env.TIMES || "900000", 10);
const MAX = parseInt(process.env.MAX || "100", 10);

app.use(
  rateLimit({
    windowMs: TIMES,
    max: MAX,
  })
);

// Configuración de CORS
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const allowedOrigins = ["http://localhost:5173", "https://tu-dominio.com"];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No autorizado"));
    }
  },
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
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ where: { isAdmin: true } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        10
      );
      await User.create({
        username: "admin",
        password: hashedPassword,
        email: "admin@example.com",
        isAdmin: true,
      });
      console.log("Administrador creado por defecto.");
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
  await createAdminUser();
});

export default app;
