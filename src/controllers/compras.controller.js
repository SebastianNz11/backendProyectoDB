import { pool } from "../db.js";
import PDFDocument from "pdfkit";
import blobStream from "blob-stream";
import concat from "concat-stream";

//controlador para traer información de  compras
export const getCompras = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM compras");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(404).json({ message: "Error al obtener infomación" });
  }
};

// controlador para obtener información de una compra
export const getComprasById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM compras WHERE id_compra = $1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Compra no encontrada" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {}
};

// controlador para insertar una compra
export const insertCompras = async (req, res) => {
  try {
    const { detalle_compra, vendedor, fecha_compra, no_factura, total } =
      req.body;
    const result = await pool.query(
      "INSERT INTO compras (detalle_compra, vendedor, fecha_compra, no_factura, total) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [detalle_compra, vendedor, fecha_compra, no_factura, total]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al ingresar la compra" });
  }
};

//controlador para actualizar una compra
export const updateCompras = async (req, res) => {
  try {
    const { id } = req.params;
    const { detalle_compra, vendedor, fecha_compra, no_factura, total } =
      req.body;
    const result = await pool.query(
      "UPDATE compras SET detalle_compra = $1, vendedor = $2, fecha_compra = $3, no_factura = $4, total = $5 WHERE id_compra = $6 RETURNING *",
      [detalle_compra, vendedor, fecha_compra, no_factura, total, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Compra no encontrada" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al actualizar una compra" });
  }
};

// coontrolador para eliminar una compra
export const deleteCompras = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM compras WHERE id_compra = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Compra no encontrada" });
    } else {
      res.status(200).json({ message: "Compra eliminada" });
    }
  } catch (error) {
    res.status(404).json({ message: "Error al eliminar compra" });
  }
};

// Controlador para generar un reporte de compras en PDF
export const generarReporteComprasPDF = async (req, res) => {
  const { mes, anio } = req.params;

  try {
    // Obtener los datos de las compras para el mes y año especificados
    const result = await pool.query(
      "SELECT * FROM compras WHERE EXTRACT(MONTH FROM fecha_compra) = $1 AND EXTRACT(YEAR FROM fecha_compra) = $2",
      [mes, anio]
    );

    // Verificar los resultados de la consulta
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "No se encontraron datos para el mes y año seleccionados",
      });
      return;
    }

    // Crear un nuevo documento PDF en memoria
    const doc = new PDFDocument();
    const stream = concat((pdfBuffer) => {
      // Enviar el PDF como respuesta al cliente
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="reporte_compras_mes_${mes}_año_${anio}.pdf"`,
      });
      res.send(pdfBuffer);
    });

    // Pipe the PDF document to the concat stream
    doc.pipe(stream);

    // Agregar contenido al PDF
    doc.fontSize(16).text("Reporte de Compras", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Mes: ${mes}, Año: ${anio}`).moveDown();

    result.rows.forEach((compra, index) => {
      doc.text(`Compra ${index + 1}`);
      doc.text(`ID: ${compra.id_compra}`);
      doc.text(`Fecha: ${compra.fecha_compra}`);
      doc.text(`Monto: ${compra.detalle_compra}`);
      doc.text(`Proveedor: ${compra.vendedor}`);
      doc.text(`No_factura: ${compra.no_factura}`);
      doc.text(`Total: ${compra.total}`);
      doc.moveDown();
    });

    // Finalizar el PDF
    doc.end();
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res
      .status(500)
      .json({ message: "Error al generar el PDF", error: error.message });
  }
};


export const generarReporteComprasAnualesPDF = async (req, res) => {
  const { anio } = req.params;

  try {
    // Obtener los datos de todas las compras para el año especificado
    const result = await pool.query(
      "SELECT * FROM compras WHERE EXTRACT(YEAR FROM fecha_compra) = $1",
      [anio]
    );

    // Verificar los resultados de la consulta
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "No se encontraron datos de compras para el año seleccionado",
      });
      return;
    }

    // Crear un nuevo documento PDF en memoria
    const doc = new PDFDocument();
    const stream = concat((pdfBuffer) => {
      // Enviar el PDF como respuesta al cliente
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="reporte_compras_anuales_${anio}.pdf"`,
      });
      res.send(pdfBuffer);
    });

    // Pipe the PDF document to the concat stream
    doc.pipe(stream);

    // Agregar contenido al PDF
    doc.fontSize(16).text("Reporte de Compras Anuales", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Año: ${anio}`).moveDown();

    // Agregar detalles de cada compra
    result.rows.forEach((compra, index) => {
      doc.text(`Compra ${index + 1}`);
      doc.text(`ID: ${compra.id_compra}`);
      doc.text(`Fecha: ${compra.fecha_compra}`);
      doc.text(`Monto: ${compra.detalle_compra}`);
      doc.text(`Proveedor: ${compra.vendedor}`);
      doc.text(`No_factura: ${compra.no_factura}`);
      doc.text(`Total: ${compra.total}`);
      doc.moveDown();
    });

    // Finalizar el PDF
    doc.end();
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res
      .status(500)
      .json({ message: "Error al generar el PDF", error: error.message });
  }
};

