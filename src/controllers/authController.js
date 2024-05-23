import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from "../db.js";

const jwtSecret = 'clave';

const register = async (req, res) => {
  const { nombre, contrasenia, rol } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM usuario WHERE nombre = $1', [nombre]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);
    await pool.query('INSERT INTO usuario (nombre, contrasenia, rol) VALUES ($1, $2, $3)', [nombre, hashedPassword, rol]);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

const login = async (req, res) => {
  const { nombre, contrasenia } = req.body;

  try {
    const user = await pool.query('SELECT * FROM usuario WHERE nombre = $1', [nombre]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Nombre de usuario o contraseña incorrectos' });
    }

    const validPassword = await bcrypt.compare(contrasenia, user.rows[0].contrasenia);
    if (!validPassword) {
      return res.status(400).json({ message: 'Nombre de usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ id_usuario: user.rows[0].id_usuario, rol: user.rows[0].rol }, jwtSecret);
    res.cookie('token', token, { httpOnly: true }).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token no es válido' });
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes acceso a esta ruta' });
    }
    next();
  };
};

export { register, login, authenticateToken, authorizeRole };
