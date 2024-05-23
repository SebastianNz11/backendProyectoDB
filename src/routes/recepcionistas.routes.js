import { Router } from "express";
import {
  getRecepcionistas,
  getRecepcionistasById,
  insertRecepcionista,
  updateRecepcionista,
  deleteRecepcionista,
} from "../controllers/recepcionistas.controller.js";

const recepcionistasRouter = Router();

recepcionistasRouter.get("/recepcionistas", getRecepcionistas);
recepcionistasRouter.get("/recepcionistas/:id", getRecepcionistasById);
recepcionistasRouter.post("/recepcionistas", insertRecepcionista);
recepcionistasRouter.patch("/recepcionistas/:id", updateRecepcionista);
recepcionistasRouter.delete("/recepcionistas/:id", deleteRecepcionista);

export default recepcionistasRouter;
