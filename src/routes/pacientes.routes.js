import { Router } from "express";
import {
  getPacientes,
  getPacienteById,
  insertPaciente,
  updatePaciente,
  deletePaciente,
} from "../controllers/pacientes.controller.js";

const pacientesRoutes = Router();

pacientesRoutes.get("/pacientes", getPacientes);
pacientesRoutes.get("/pacientes/:id", getPacienteById);
pacientesRoutes.post("/pacientes", insertPaciente);
pacientesRoutes.patch("/pacientes/:id", updatePaciente);
pacientesRoutes.delete("/pacientes/:id", deletePaciente);

export default pacientesRoutes;
