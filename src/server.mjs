import "dotenv/config";
import express from "express";
import cors from "cors";
import { dbConfig } from "./config/db.mjs";
import formulasRouter from "./routes/formulas.mjs";
import expedientesRouter from "./routes/expedientes.mjs";
import cotizacionesRouter from "./routes/cotizaciones.mjs";
import foldersFormulasRouter from "./routes/foldersFormulas.mjs";
import materialesRouter from "./routes/materiales.mjs";

const PORT = process.env.PORT || 3000;
const dt = new Date();

try {
  await dbConfig.client.connect();
  await dbConfig.db().command({ ping: 1 });
  console.log(`Conectado a la base de datos: iguapp`);
} catch (error) {
  console.error("Error al conectar a la base de datos:", error.message);
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Iguapp test" });
});

app.get("/version", (req, res) => {
  res.send({ version: dt.toString() });
});

app.use("/api/materiales", materialesRouter);
app.use("/api/formulas", formulasRouter);
app.use("/api/expedientes", expedientesRouter);
app.use("/api/cotizaciones", cotizacionesRouter);
app.use("/api/folders-formulas", foldersFormulasRouter);

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});
