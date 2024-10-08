import { Request, Response } from "express";
import SalesModel from "../model/SalesModel";
import { sendEmail } from "../Emails/emailController";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import cloudinary from "../config/cloudinaryConfig";
import fs from "fs";
import path = require("path/posix");

interface CloudinaryUploadResult {
  secure_url: string;
  // Agrega otras propiedades que necesites del resultado de la carga
}



const generatePDFBuffer = (
  cart: any[],
  total: number,
  userId: number
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });
    const stream = new PassThrough();
    const buffers: Buffer[] = [];

    // Pipe PDF output to the buffer
    stream.on("data", (chunk) => buffers.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(buffers)));
    stream.on("error", (err) => reject(err));

    doc.pipe(stream);

    // Header with logo
    doc
      .image(path.join(__dirname, "logo.png"), {
        fit: [100, 100],
        align: "center",
        valign: "center",
      })
      .moveDown(5) // Añadir margen de 5 rem (aproximadamente 10 en puntos) después del logo
      .fontSize(22)
      .text("Recibo de Compra", { align: "center", underline: true })
      .moveDown(1);

    // Customer details
    doc
      .fontSize(12)
      .text(`Usuario: ${userId}`, { align: "left" })
      .text(`Fecha: ${new Date().toLocaleDateString()}`, { align: "left" })
      .moveDown();

    // Introduction
    doc
      .moveDown(2) // Añadir margen superior antes de la introducción
      .fontSize(12)
      .text("Gracias por su compra. Aquí está el resumen de su pedido:", {
        align: "left",
      })
      .moveDown();

    // Table of purchased items
    doc
      .fontSize(14)
      .text("Artículos Comprados:", { underline: true })
      .moveDown()
      .fontSize(12);

    const tableTop = doc.y + 20; // Ajustar la posición de la tabla

    // Draw table headers
    doc.text("Artículo", 50, tableTop);
    doc.text("Precio", 200, tableTop, { width: 90, align: "right" });
    doc.text("Cantidad", 300, tableTop, { width: 90, align: "right" });
    doc.moveDown();

    // Draw table rows
    cart.forEach((item: any) => {
      const itemY = doc.y; // Obtener la posición actual de y
      doc.text(item.name, 50, itemY);
      doc.text(`$${item.price.toFixed(2)}`, 200, itemY, {
        width: 90,
        align: "right",
      });
      doc.text(`${item.quantity}`, 300, itemY, { width: 90, align: "right" });
      doc.moveDown(); // Mover hacia abajo para el siguiente item
    });

    doc
      .moveDown(5) // Aumentar el espacio después de la tabla
      .fontSize(12)
      .text(`Total: $${total.toFixed(2)}`, { align: "right", underline: true });

    // Footer with additional information
    doc
      .moveDown(2)
      .fontSize(10)
      .text("Gracias por su compra!", { align: "center" })
      .text("Para más información, visita nuestro sitio web:", {
        align: "center",
      })
      .text("www.ejemplo.com", { align: "center", underline: true })
      .moveDown(1)
      .text("Si tienes alguna pregunta, no dudes en contactarnos:", {
        align: "center",
      })
      .text("contacto@empresa.com", { align: "center" });

    // Add a border at the bottom of the page
    const yBottom = doc.y + 30;
    doc.moveTo(50, yBottom).lineTo(550, yBottom).stroke();

    doc.end();
  });
};
// Función para subir el PDF a Cloudinary
const uploadToCloudinary = (
  buffer: Buffer
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "raw", public_id: "receipt" }, // Puedes ajustar el public_id según tus necesidades
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      )
      .end(buffer); // Finaliza el flujo con el buffer
  });
};

export const registerSale = async (req: Request, res: Response) => {
  const { userId, cart, total, email } = req.body;

  if (!userId || !cart || !total || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Guardar el snapshot de la compra
    const snapshot = JSON.stringify(cart);

    // Registrar la venta en la base de datos
    const sale = await SalesModel.create({
      userId,
      snapshot,
      total,
    });

    // Generar el PDF en un buffer
    const pdfBuffer = await generatePDFBuffer(cart, total, userId);

    // Subir el PDF a Cloudinary
    const uploadResult = await uploadToCloudinary(pdfBuffer);
    const pdfUrl = uploadResult.secure_url;

    // Actualizar la venta con la URL del PDF
    await sale.update({ pdfUrl });

    // Enviar correo de confirmación al usuario con el PDF adjunto
    await sendEmail({
      subject: "Confirmación de Compra",
      html: `<p>Gracias por tu compra. Tu total fue: $${total}. Aquí están los detalles:</p><pre>${snapshot}</pre>`,
      attachments: [
        {
          filename: "receipt.pdf",
          path: pdfUrl,
        },
      ],
    });

    res.status(201).json({ message: "Sale registered successfully", sale });
  } catch (error) {
    console.error("Error registering sale:", error);

    // Manejo específico del error
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to register sale", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Failed to register sale", error: "Unknown error" });
    }
  }
};


// Buscar compra por ID
export const getSaleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Missing required field: id" });
  }

  try {
    // Buscar la venta en la base de datos
    const sale = await SalesModel.findByPk(id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({ sale });
  } catch (error) {
    console.error("Error fetching sale:", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to fetch sale", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Failed to fetch sale", error: "Unknown error" });
    }
  }
};

// Obtener todas las ventas
export const getAllSales = async (req: Request, res: Response) => {
  try {
    // Obtener todas las ventas de la base de datos
    const sales = await SalesModel.findAll();

    res.status(200).json({ sales });
  } catch (error) {
    console.error("Error fetching sales:", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to fetch sales", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Failed to fetch sales", error: "Unknown error" });
    }
  }
};
