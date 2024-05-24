import { pool } from "../db.js";

// Controlador para obtener todos los diagnósticos
export const obtenerDiagnosticos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM diagnosticos");
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error al obtener información de diagnósticos" });
      console.log(error)
  }
};

// Controlador para obtener un diagnóstico por su ID
export const obtenerDiagnosticoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM diagnosticos WHERE id_diagnostico = $1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Diagnóstico no encontrado" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener diagnóstico por ID" });
  }
};

// Controlador para insertar un nuevo diagnóstico
export const insertarDiagnostico = async (req, res) => {
  try {
    const {
      id_medico,
      id_procedimiento_med,
      id_paciente,
      fecha_diagnostico,
      detalle_medicamento,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO diagnosticos (id_medico, id_procedimiento_med, id_paciente, fecha_diagnostico, detalle_medicamento) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        id_medico,
        id_procedimiento_med,
        id_paciente,
        fecha_diagnostico,
        detalle_medicamento,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al insertar un diagnóstico" });
  }
};

// Controlador para actualizar un diagnóstico existente
export const actualizarDiagnostico = async (req, res) => {
  const { id } = req.params;
  const {
    id_medico,
    id_procedimiento_med,
    id_paciente,
    fecha_diagnostico,
    detalle_medicamento,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE diagnosticos SET id_medico = $1, id_procedimiento_med = $2, id_paciente = $3, fecha_diagnostico = $4, detalle_medicamento = $5 WHERE id_diagnostico = $6 RETURNING *",
      [
        id_medico,
        id_procedimiento_med,
        id_paciente,
        fecha_diagnostico,
        detalle_medicamento,
        id,
      ]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Diagnóstico no encontrado" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar diagnóstico" });
  }
};

// Controlador para eliminar un diagnóstico
export const eliminarDiagnostico = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM diagnosticos WHERE id_diagnostico = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Diagnóstico no encontrado" });
    } else {
      res.status(200).json({ message: "Diagnóstico eliminado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar diagnóstico" });
  }
};
