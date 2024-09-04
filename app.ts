import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import errorHandler from "./src/middleware/errors/errorHeanler";
import indexRoutes from "./src/Routes/indexRoutes";
const app = express();



dotenv.config();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(helmet());

// Configuración de límites de tasa
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

// Rutas
app.use("/", indexRoutes); 
app.use(errorHandler);

// Configuración del puerto y arranque del servidor
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);
console.log(process.env.PORT);

