import { Router } from "express";
import {
  postUser,
  getUsuarios,
  getUsuarioId,
  updateUsuario,
  deleteUser,
} from "../controllers/registro.controller.js";
import validateJWT from "../middlewares/validar-jwt.js";

const registroRoutes = Router();

registroRoutes.post("/registro", postUser);
registroRoutes.get("/registro", [validateJWT], getUsuarios);
registroRoutes.get("/registro/:id", getUsuarioId);
registroRoutes.patch("/registro/:id", updateUsuario);
registroRoutes.delete("/registro/:id", deleteUser);

export default registroRoutes;
