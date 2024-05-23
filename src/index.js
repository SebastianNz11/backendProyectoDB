import express from "express";
import cors from "cors";
import registroRoutes from "./routes/registro.route.js";
import empleadosRoutes from "./routes/empleados.routes.js";
import comprasRoutes from "./routes/compras.routes.js";
import medicosRoutes from "./routes/medicos.routes.js";
import enfermerosRoutes from "./routes/enfermeros.routes.js";
import pacientesRoutes from "./routes/pacientes.routes.js";
import recepcionistasRoutes from "./routes/recepcionistas.routes.js";
import procedimientosRoutes from "./routes/procedimientos.routes.js";
import diagnosticosRouter from "./routes/diagnosticos.routes.js";
import citasRouter from "./routes/citas.routes.js";
import facturasRouter from "./routes/facturas.routes.js";
import authRouter from './routes/authRoutes.js'

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "PATCH", "POST", "DELETE"],
  })
);

//middleware de login
app.use("/api", authRouter);

//middleware de registro
app.use("/api", registroRoutes);

//middleware de empleados
app.use("/api", empleadosRoutes);

//middelware de compras
app.use("/api", comprasRoutes);

//middelware de medicos
app.use("/api", medicosRoutes);

//middelware de enfermeros
app.use("/api", enfermerosRoutes);

//middelware de pacientes
app.use("/api", pacientesRoutes);

//middelware de recepcionistas
app.use("/api", recepcionistasRoutes);

//middelware de procedimientos
app.use("/api", procedimientosRoutes);

//middelware de diagnosticos
app.use("/api", diagnosticosRouter);

//middelware de citas
app.use("/api", citasRouter);

//middelware de facturas
app.use("/api", facturasRouter);



app.listen(4000);
console.log("Escuchando en el puerto 4000");
