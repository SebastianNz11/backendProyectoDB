import { Router } from "express";
import {
  actualizarFactura,
  eliminarFactura,
  generarFacturaPDF,
  insertarFactura,
  obtenerFacturaPorId,
  obtenerFacturas,
} from "../controllers/facturas.controller.js";

const facturasRouter = Router();

facturasRouter.get("/facturas", obtenerFacturas);
facturasRouter.get("/facturas/:id", obtenerFacturaPorId);
facturasRouter.post("/facturas", insertarFactura);
facturasRouter.delete("/facturas/:id", eliminarFactura);
facturasRouter.patch("/facturas/:id", actualizarFactura);
facturasRouter.get("/facturas/pdf/:id", generarFacturaPDF);

export default facturasRouter;
