import { pool } from "../db.js";

//controlador para traer informacion de recepcionistas
export const getRecepcionistas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recepcionistas");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(404).json({ message: "Error al obtener infomación" });
  }
};

// controlador para obtener informacion de un recepcionista
export const getRecepcionistasById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM recepcionistas WHERE  id_recepcionista = $1",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Recepcionista no encontrado" });
  } else {
    res.status(200).json(result.rows[0]);
  }
};

//controlador para insertar recepcionista
export const insertRecepcionista = async (req, res) => {
  try {
    const { nombre, apellido, no_identificacion } = req.body;
    const result = await pool.query(
      "INSERT INTO recepcionistas (nombre, apellido, no_identificacion) VALUES ( $1, $2, $3) RETURNING *",
      [nombre, apellido, no_identificacion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al ingresar un recepcionista" });
  }
};


//controlador para actualizar recepcionista

export const updateRecepcionista = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, no_identificacion} = req.body;
  const result = await pool.query(
    "UPDATE recepcionistas SET nombre = $1, apellido = $2, no_identificacion = $3   WHERE id_recepcionista = $4 RETURNING *",
    [nombre, apellido, no_identificacion, id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Recepcionista no encontrado" });
  }
  return res.json(result.rows[0]);
};

//controlador para eliminar recepcionista
export const deleteRecepcionista = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM recepcionistas WHERE id_recepcionista = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Recepcionistas no encontrado" });
    } else {
      res.status(200).json({ message: "Recepcionistas eliminado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar recepcionista" });
  }
};
