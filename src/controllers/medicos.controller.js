import { pool } from "../db.js";

//controlador para traer informacion de medicos
export const getMedico = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM medicos");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(404).json({ message: "Error al obtener infomación" });
  }
};

// controlador para obtener informacion de un medico
export const getMedicoById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM medicos WHERE  id_medico = $1",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Medico no encontrado" });
  } else {
    res.status(200).json(result.rows[0]);
  }
};

//controlador para insertar medico
export const insertMedico = async (req, res) => {
  try {
    const { nombre, apellido, no_colegiado, especialidad } = req.body;
    const result = await pool.query(
      "INSERT INTO medicos (nombre, apellido, no_colegiado, especialidad) VALUES ( $1, $2, $3, $4) RETURNING *",
      [nombre, apellido, no_colegiado, especialidad]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al ingresar un medico" });
  }
};

//controlador para actualizar medico
export const updateMedico = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, no_colegiado, especialidad } = req.body;
  const result = await pool.query(
    "UPDATE medicos SET nombre = $1, apellido = $2, no_colegiado = $3, especialidad = $4 WHERE id_medico = $5 RETURNING *",
    [nombre, apellido, no_colegiado, especialidad, id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Medico no encontrado" });
  }
  return res.json(result.rows[0]);
};

//controlador para eliminar medicos
export const deleteEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM medicos WHERE id_medico = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Medico no encontrado" });
    } else {
      res.status(200).json({ message: "Medico eliminado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar Medico" });
  }
};
