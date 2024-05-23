import { pool } from "../db.js";

//controlador para traer infomación de empleados
export const getEmpleados = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM empleado");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(404).json({ message: "Error al obtener información" });
  }
};

// controlador para obtener informacion de un empleado
export const getEmpleadoById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM empleado WHERE  id_empleado = $1",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Empleado no encontrado" });
  } else {
    res.status(200).json(result.rows[0]);
  }
};

//controlador para insertar empleado
export const insertEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, empleado, salario } = req.body;
    console.log(salario);
    const result = await pool.query(
      "INSERT INTO empleado (nombre, apellido, tipo_empleado, salario) VALUES ( $1, $2, $3, $4) RETURNING *",
      [nombre, apellido, empleado, salario]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al ingresar un empleado" });
  }
};

//controlador para actualizar empleado
export const updateEmpleado = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, empleado, salario } = req.body;
  const result = await pool.query(
    "UPDATE empleado SET nombre = $1, apellido = $2, tipo_empleado = $3, salario= $4 WHERE id_empleado = $5 RETURNING *",
    [nombre, apellido, empleado, salario, id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Empleado no encontrado" });
  }
  return res.json(result.rows[0]);
};

//controlador para eliminar empleado
export const deleteEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM empleado WHERE id_empleado = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Empleado no encontrado" });
    } else {
      res.status(200).json({ message: "Empleado eliminado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar empleado" });
  }
};
