import { Router } from "express";
import {
  getProcedimientos,
  getProcedimientoById,
  insertProcedimiento,
  updateProcedimiento,
  deleteProcedimiento,
} from "../controllers/procedimientos.controller.js";

const procedimientosRoutes = Router();

procedimientosRoutes.get("/procedimientos", getProcedimientos);
procedimientosRoutes.get("/procedimientos/:id", getProcedimientoById);
procedimientosRoutes.post("/procedimientos", insertProcedimiento);
procedimientosRoutes.patch("/procedimientos/:id", updateProcedimiento);
procedimientosRoutes.delete("/procedimientos/:id", deleteProcedimiento);

export default procedimientosRoutes;
