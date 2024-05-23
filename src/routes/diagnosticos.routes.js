import {Router} from 'express'
import {insertarDiagnostico, obtenerDiagnosticoPorId, obtenerDiagnosticos, actualizarDiagnostico, eliminarDiagnostico } from '../controllers/diagnosticos.controller.js'

const diagnosticosRouter = Router();

diagnosticosRouter.get("/diagnosticos", obtenerDiagnosticos );
diagnosticosRouter.get("/diagnosticos/:id", obtenerDiagnosticoPorId);
diagnosticosRouter.post("/diagnosticos", insertarDiagnostico );
diagnosticosRouter.delete("/diagnosticos/:id", eliminarDiagnostico);
diagnosticosRouter.patch("/diagnosticos/:id", actualizarDiagnostico );

export default diagnosticosRouter;
