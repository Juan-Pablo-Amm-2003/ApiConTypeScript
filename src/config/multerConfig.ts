import multer from "multer";
import path from "path";

// Configuración del almacenamiento
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    // Asegúrate de que el archivo sea una imagen
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
  },
});

export default upload;
