import { pool } from "../db.js";

// Controlador para obtener todas las citas
export const obtenerCitas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM citas");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(404).json({ message: "Error al obtener información de citas" });
  }
};

// Controlador para obtener una cita por su ID
export const obtenerCitaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM citas WHERE id_cita = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Cita no encontrada" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cita por ID" });
  }
};

// Controlador para insertar una nueva cita
export const insertarCita = async (req, res) => {
  try {
    const {
      id_paciente,
      id_medico,
      id_enfermero,
      id_recepcionista,
      fecha_cita,
      hora_cita,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO citas (id_paciente, id_medico, id_enfermero, id_recepcionista, fecha_cita, hora_cita) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        id_paciente,
        id_medico,
        id_enfermero,
        id_recepcionista,
        fecha_cita,
        hora_cita,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al insertar una cita" });
  }
};

// Controlador para actualizar una cita existente
export const actualizarCita = async (req, res) => {
  const { id } = req.params;
  const {
    id_paciente,
    id_medico,
    id_enfermero,
    id_recepcionista,
    fecha_cita,
    hora_cita,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE citas SET id_paciente = $1, id_medico = $2, id_enfermero = $3, id_recepcionista = $4, fecha_cita = $5, hora_cita = $6 WHERE id_cita = $7 RETURNING *",
      [
        id_paciente,
        id_medico,
        id_enfermero,
        id_recepcionista,
        fecha_cita,
        hora_cita,
        id,
      ]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Cita no encontrada" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cita" });
  }
};

// Controlador para eliminar una cita
export const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM citas WHERE id_cita = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Cita no encontrada" });
    } else {
      res.status(200).json({ message: "Cita eliminada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cita" });
  }
};
