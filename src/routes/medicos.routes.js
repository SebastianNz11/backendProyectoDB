import { Router } from "express";
import {
  getMedico,
  getMedicoById,
  insertMedico,
  updateMedico,
  deleteEmpleado,
} from "../controllers/medicos.controller.js";
const medicosRoutes = Router();

medicosRoutes.get("/medicos", getMedico);
medicosRoutes.get("/medicos/:id", getMedicoById);
medicosRoutes.post("/medicos", insertMedico);
medicosRoutes.patch("/medicos/:id", updateMedico);
medicosRoutes.delete("/medicos/:id", deleteEmpleado);

export default medicosRoutes;
