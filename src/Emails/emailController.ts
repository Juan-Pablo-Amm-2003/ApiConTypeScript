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

// Crea el contenido HTML mejorado
const createHtmlContent = (recipientName: string) => `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #0056b3;
          font-size: 24px;
        }
        p {
          line-height: 1.6;
          font-size: 16px;
        }
        a {
          color: #0056b3;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        footer {
          margin-top: 20px;
          font-size: 12px;
          color: #aaa;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hola, ${recipientName}!</h1>
        <p>Gracias por unirte a nosotros. Estamos emocionados de tenerte aquí.</p>
        <p>Para comenzar, visita nuestro <a href="https://example.com">sitio web</a> para obtener más información.</p>
        <p>Si tienes alguna pregunta, no dudes en <a href="mailto:support@example.com">contactarnos</a>.</p>
        <footer>
          <p>Este es un correo electrónico automático, por favor no respondas.</p>
        </footer>
      </div>
    </body>
  </html>
`;

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

// Uso de la función para enviar el correo
const options: EmailOptions = {
  subject: "Bienvenido a nuestro servicio",
  html: createHtmlContent("Juan Pablo"),
  attachments: [], // Puedes añadir tus archivos adjuntos si los tienes
};

sendEmail(options)
  .then((response) => console.log("Email enviado:", response))
  .catch((error) => console.error("Error al enviar el email:", error));
