import { Router } from "express";
import {
  postUser,
  getUsuarios,
  getUsuarioId,
  updateUsuario,
  deleteUser,
} from "../controllers/registro.controller.js";

const registroRoutes = Router();

registroRoutes.post("/registro", postUser);
registroRoutes.get("/registro", getUsuarios);
registroRoutes.get("/registro/:id", getUsuarioId);
registroRoutes.patch("/registro/:id", updateUsuario);
registroRoutes.delete("/registro/:id", deleteUser);

export default registroRoutes;
