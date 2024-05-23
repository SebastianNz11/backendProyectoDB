import { pool } from "../db.js";

//controlador para traer informacion de procedimientos
export const getProcedimientos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM procedimiento_med");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(404).json({ message: "Error al obtener infomación" });
  }
};

// controlador para obtener informacion de un procedimiento
export const getProcedimientoById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM procedimiento_med WHERE  id_procedimiento_med = $1",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Procedimiento no encontrado" });
  } else {
    res.status(200).json(result.rows[0]);
  }
};

//controlador para insertar procedimiento
export const insertProcedimiento = async (req, res) => {
  try {
    const { duracion, descripcion, costo } = req.body;
    const result = await pool.query(
      "INSERT INTO procedimiento_med (duracion, descripcion, costo) VALUES ( $1, $2, $3) RETURNING *",
      [duracion, descripcion, costo]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al ingresar un procedimiento" });
  }
};

//controlador para actualizar procedimiento
export const updateProcedimiento = async (req, res) => {
  const { id } = req.params;
  const { duracion, descripcion, costo } = req.body;
  const result = await pool.query(
    "UPDATE procedimiento_med SET duracion = $1, descripcion = $2, costo = $3 WHERE id_procedimiento_med = $4 RETURNING *",
    [duracion, descripcion, costo, id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Procedimiento no encontrado" });
  }
  return res.json(result.rows[0]);
};

//controlador para eliminar Procedimiento
export const deleteProcedimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM procedimiento_med WHERE id_procedimiento_med = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Procedimiento no encontrado" });
    } else {
      res.status(200).json({ message: "Procedimiento eliminado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar Procedimiento" });
  }
};
