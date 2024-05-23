import { pool } from "../db.js";
import PDFDocument from "pdfkit";
import concat from "concat-stream";

// Controlador para obtener todas las facturas
export const obtenerFacturas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM facturas");
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error al obtener información de facturas" });
  }
};

// Controlador para obtener una factura por su ID
export const obtenerFacturaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM facturas WHERE id_factura = $1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Factura no encontrada" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener factura por ID" });
  }
};

// Controlador para insertar una nueva factura
export const insertarFactura = async (req, res) => {
  try {
    const { id_diagnostico, costo_adicional, fecha_emision } = req.body;

    const result = await pool.query(
      "INSERT INTO facturas (id_diagnostico, costo_adicional, fecha_emision) VALUES ($1, $2, $3) RETURNING *",
      [id_diagnostico, costo_adicional, fecha_emision]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al insertar una factura" });
  }
};

// Controlador para actualizar una factura existente
export const actualizarFactura = async (req, res) => {
  const { id } = req.params;
  const { id_diagnostico, costo_adicional, fecha_emision } = req.body;
  try {
    const result = await pool.query(
      "UPDATE facturas SET id_diagnostico = $1, costo_adicional = $2, fecha_emision = $3 WHERE id_factura = $4 RETURNING *",
      [id_diagnostico, costo_adicional, fecha_emision, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Factura no encontrada" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar factura" });
  }
};

// Controlador para eliminar una factura
export const eliminarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM facturas WHERE id_factura = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Factura no encontrada" });
    } else {
      res.status(200).json({ message: "Factura eliminada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar factura" });
  }
};

export const generarFacturaPDF = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener los datos de la factura seleccionada y sus relaciones con las tablas DIAGNOSTICOS y PROCEDIMIENTO_MED
    const result = await pool.query(
      "SELECT f.*, d.fecha_diagnostico, d.detalle_medicamento, p.costo AS costo_procedimiento, d.id_paciente, d.id_procedimiento_med " +
        "FROM facturas f " +
        "JOIN diagnosticos d ON f.id_diagnostico = d.id_diagnostico " +
        "JOIN procedimiento_med p ON d.id_procedimiento_med = p.id_procedimiento_med " +
        "WHERE f.id_factura = $1",
      [id]
    );

    // Verificar si se encontraron datos para la factura especificada
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "No se encontraron datos para la factura especificada",
      });
      return;
    }

    // Extraer los datos de la factura y sus relaciones
    const {
      id_factura,
      fecha_emision,
      costo_adicional,
      fecha_diagnostico,
      detalle_medicamento,
      costo_procedimiento,
      id_paciente,
      id_procedimiento_med,
    } = result.rows[0];

    // Calcular el costo total sumando el costo adicional y el costo del procedimiento médico
    const costoTotal =
      parseFloat(costo_adicional) + parseFloat(costo_procedimiento);

    // Obtener los datos del paciente
    const pacienteResult = await pool.query(
      "SELECT * FROM pacientes WHERE id_paciente = $1",
      [id_paciente]
    );

    // Obtener los datos del procedimiento médico
    const procedimientoMedicoResult = await pool.query(
      "SELECT * FROM procedimiento_med WHERE id_procedimiento_med = $1",
      [id_procedimiento_med]
    );

    // Crear un nuevo documento PDF en memoria
    const doc = new PDFDocument();
    const stream = concat((pdfBuffer) => {
      // Enviar el PDF como respuesta al cliente
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="factura_${id_factura}.pdf"`,
      });
      res.send(pdfBuffer);
    });

    // Pipe the PDF document to the concat stream
    doc.pipe(stream);

    // Agregar contenido al PDF
    doc.fontSize(16).text("Factura", { align: "center" }).moveDown();
    doc.fontSize(12).text(`ID de Factura: ${id_factura}`).moveDown();
    doc.text(`Fecha de Emisión: ${fecha_emision}`).moveDown();
    doc.text(`Fecha del Diagnóstico: ${fecha_diagnostico}`).moveDown();
    doc.text(`Detalle del Medicamento: ${detalle_medicamento}`).moveDown();

    if (pacienteResult.rows.length > 0) {
      const paciente = pacienteResult.rows[0];
      doc.text(`Datos del Paciente:`).moveDown();
      doc.text(`Nombre: ${paciente.nombre}`).moveDown();
      doc.text(`Apellido: ${paciente.apellido}`).moveDown();
      doc.text(`Correo: ${paciente.correo}`).moveDown();
      doc.text(`Teléfono: ${paciente.telefono}`).moveDown();
      doc.text(`Dirección: ${paciente.direccion}`).moveDown();
      doc.text(`DPI: ${paciente.dpi}`).moveDown();
    }

    // Agregar información del procedimiento médico al PDF
    if (procedimientoMedicoResult.rows.length > 0) {
      const procedimientoMedico = procedimientoMedicoResult.rows[0];
      doc.text(`Datos del Procedimiento Médico:`).moveDown();
      doc.text(`Duración: ${procedimientoMedico.duracion}`).moveDown();
      doc.text(`Descripción: ${procedimientoMedico.descripcion}`).moveDown();
    }

    doc.text(`Costo Adicional: ${costo_adicional}`).moveDown();
    doc.text(`Costo del Procedimiento: ${costo_procedimiento}`).moveDown();
    doc.text(`Costo Total: ${costoTotal}`).moveDown();

    // Finalizar el PDF
    doc.end();
  } catch (error) {
    console.error("Error al generar el PDF de la factura:", error);
    res.status(500).json({
      message: "Error al generar el PDF de la factura",
      error: error.message,
    });
  }
};
