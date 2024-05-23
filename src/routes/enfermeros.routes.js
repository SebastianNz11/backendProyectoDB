import { Router } from "express";
import {
  getEnfermero,
  getEnfermeroById,
  insertEnfermero,
  updateEnfermero,
  deleteEnfermero,
} from "../controllers/enfermeros.controller.js";

const enfermerosRouter = Router();

enfermerosRouter.get("/enfermeros", getEnfermero);
enfermerosRouter.get("/enfermeros/:id", getEnfermeroById);
enfermerosRouter.post("/enfermeros", insertEnfermero);
enfermerosRouter.patch("/enfermeros/:id", updateEnfermero);
enfermerosRouter.delete("/enfermeros/:id", deleteEnfermero);

export default enfermerosRouter;
