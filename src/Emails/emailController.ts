import { Resend } from "resend";
import dotenv from "dotenv";

// Cargar las variables de entorno
dotenv.config();

interface EmailOptions {
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}


// Inicializa Resend con la API Key desde el entorno
const resend = new Resend(process.env.RESEND_API_KEY as string);

// Cambia la función sendEmail para que reciba un objeto con los detalles del correo
export const sendEmail = async (options: EmailOptions) => {
  const { subject, html, attachments } = options;
  const to = "juanpabloammiraglia18@gmail.com"; // Correo de destino
  const from = "onboarding@resend.dev"; // Correo del remitente (puede ser fijo para pruebas)

  if (!subject || !html) {
    throw new Error("Missing required fields");
  }

  try {
    // Envía el correo electrónico usando Resend
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      attachments, // Incluye los attachments si están presentes
    });

    // Manejo de errores de la respuesta de Resend
    if (error) {
      throw new Error(error.message);
    }

    return data; // Devuelve los datos en caso de éxito
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
