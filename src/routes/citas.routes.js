import { Router } from "express";
import {
  insertarCita,
  actualizarCita,
  eliminarCita,
  obtenerCitaPorId,
  obtenerCitas,
} from "../controllers/citas.controller.js";

const citasRouter = Router();

citasRouter.get("/citas", obtenerCitas);
citasRouter.get("/citas/:id", obtenerCitaPorId);
citasRouter.post("/citas", insertarCita);
citasRouter.delete("/citas/:id", eliminarCita);
citasRouter.patch("/citas/:id", actualizarCita);

export default citasRouter;
