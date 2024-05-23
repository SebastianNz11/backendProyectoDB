import { Router } from "express";
import {
  insertEmpleado,
  getEmpleados,
  deleteEmpleado,
  getEmpleadoById,
  updateEmpleado
} from "../controllers/empleados.controller.js";

const empleadosRoutes = Router();

empleadosRoutes.post("/empleados", insertEmpleado);
empleadosRoutes.get("/empleados", getEmpleados);
empleadosRoutes.delete("/empleados/:id", deleteEmpleado);
empleadosRoutes.get("/empleados/:id", getEmpleadoById);
empleadosRoutes.patch("/empleados/:id", updateEmpleado)

export default empleadosRoutes;
