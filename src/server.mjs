import "dotenv/config";
import express from "express";
import { ObjectId } from "mongodb";
import cors from "cors";
import { dbConfig } from "./config/db.mjs";

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
  res.send("Iguap test");
});

app.get("/version", (req, res) => {
  res.send({ version: dt.toString() });
});

app.get("/api/formulas", async (req, res) => {
  try {
    const formulas = await dbConfig
      .collection()
      .find({})
      .maxTimeMS(5000)
      .toArray();
    res.status(200).send({ error: false, data: formulas });
  } catch (error) {
    console.error("Error en GET /api/formula:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener las fórmulas" });
  }
});

app.get("/api/formulas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const formula = await dbConfig
      .collection()
      .findOne({ _id: new ObjectId(id) });
    res.status(200).send({ error: false, data: formula });
  } catch (error) {
    console.error("Error en GET /api/formula/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener la fórmula" });
  }
});

app.post("/api/formulas", async (req, res) => {
  const formula = req.body;
  try {
    const resultado = await dbConfig.collection().insertOne(formula);
    res.status(201).send({
      error: false,
      mensaje: "Fórmula guardada correctamente",
      resultado,
    });
  } catch (error) {
    console.error("Error en POST /api/formula:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al guardar la fórmula" });
  }
});

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});
