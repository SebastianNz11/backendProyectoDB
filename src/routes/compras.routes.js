import { Router } from "express";
import {
  getCompras,
  getComprasById,
  deleteCompras,
  insertCompras,
  updateCompras,
  generarReporteComprasPDF,
  generarReporteComprasAnualesPDF
} from "../controllers/compras.controller.js";

const comprasRoutes = Router();

comprasRoutes.get("/compras", getCompras);
comprasRoutes.get("/compras/reporte/:mes/:anio", generarReporteComprasPDF);
comprasRoutes.get(
  "/compras/reportetotal/:anio",
  generarReporteComprasAnualesPDF
);
comprasRoutes.get("/compras/:id", getComprasById);
comprasRoutes.post("/compras", insertCompras);
comprasRoutes.delete("/compras/:id", deleteCompras);
comprasRoutes.patch("/compras/:id", updateCompras);

export default comprasRoutes;
