import { pool } from "../db.js";

//controlador para traer informacion de pacientes
export const getPacientes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pacientes");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(404).json({ message: "Error al obtener infomación" });
  }
};

// controlador para obtener informacion de un paciente
export const getPacienteById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM pacientes WHERE  id_paciente = $1",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Paciente no encontrado" });
  } else {
    res.status(200).json(result.rows[0]);
  }
};

//controlador para insertar paciente
export const insertPaciente = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, direccion, dpi } = req.body;
    const result = await pool.query(
      "INSERT INTO pacientes (nombre, apellido, correo, telefono, direccion, dpi) VALUES ( $1, $2, $3, $4, $5, $6) RETURNING *",
      [nombre, apellido, correo, telefono, direccion, dpi]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al ingresar un paciente" });
  }
};

//controlador para actualizar pacientes
export const updatePaciente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, telefono, direccion, dpi } = req.body;
  const result = await pool.query(
    "UPDATE pacientes SET nombre = $1, apellido = $2, correo = $3, telefono = $4, direccion = $5, dpi = $6 WHERE id_paciente = $7 RETURNING *",
    [nombre, apellido, correo, telefono, direccion, dpi, id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Paciente no encontrado" });
  }
  return res.json(result.rows[0]);
};

//controlador para eliminar paciente
export const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM pacientes WHERE id_paciente = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Paciente no encontrado" });
    } else {
      res.status(200).json({ message: "Paciente eliminado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar Paciente" });
  }
};
