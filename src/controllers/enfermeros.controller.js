import { pool } from "../db.js";

//controlador para traer informacion de enfermeros
export const getEnfermero = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM enfermeros");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(404).json({ message: "Error al obtener infomación" });
  }
};

// controlador para obtener informacion de un enfermero
export const getEnfermeroById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM enfermeros WHERE  id_enfermero = $1",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Enfermero no encontrado" });
  } else {
    res.status(200).json(result.rows[0]);
  }
};

//controlador para insertar enfermero
export const insertEnfermero = async (req, res) => {
  try {
    const { nombre, apellido, identificacion } = req.body;
    const result = await pool.query(
      "INSERT INTO enfermeros (nombre, apellido, identificacion) VALUES ( $1, $2, $3) RETURNING *",
      [nombre, apellido, identificacion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al ingresar un enfermero" });
  }
};

//controlador para actualizar enfermero
export const updateEnfermero = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, identificacion } = req.body;
  const result = await pool.query(
    "UPDATE enfermeros SET nombre = $1, apellido = $2, identificacion = $3 WHERE id_enfermero = $4 RETURNING *",
    [nombre, apellido, identificacion, id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Enfermero no encontrado" });
  }
  return res.json(result.rows[0]);
};

//controlador para eliminar enfermero
export const deleteEnfermero = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM enfermeros WHERE id_enfermero = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Enfermero no encontrado" });
    } else {
      res.status(200).json({ message: "Enfermero eliminado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar Enfermero" });
  }
};
