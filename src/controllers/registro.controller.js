import { pool } from "../db.js";
import bcrypt from "bcryptjs";

// Controlador de Inserción de usuario
export const postUser = async (req, res) => {
  const { nombre, contrasenia, rol } = req.body;
  const hash = await bcrypt.hash(contrasenia, 10);
  try {
    const result = await pool.query(
      "INSERT INTO usuario (nombre, contrasenia, rol) VALUES ($1, $2, $3) RETURNING *",
      [nombre, hash, rol]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al insertar usuario" });
  }
};

// Controlador para traer todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuario");
    res.status(200).json(result.rows);
  } catch (error) {
    res.staus(500).json({ error: "Error al traer información" });
  }
};

//Controlador para obtener un usuario
export const getUsuarioId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "SELECT * FROM usuario WHERE id_usuario = $1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar información" });
  }
};

//Controlador para actualizar usuario
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, contrasenia, rol } = req.body;
    const result = await pool.query(
      "UPDATE usuario SET nombre = $1, contrasenia = $2, rol = $3 WHERE id_usuario = $4 RETURNING*",
      [nombre, contrasenia, rol, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para eliminar un usuario

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM usuario WHERE id_usuario = $1",
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
