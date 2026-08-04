import "dotenv/config";
import express from "express";
import { ObjectId } from "mongodb";
import cors from "cors";
import { dbConfig } from "./config/db.mjs";
// import { formulaMock, formulasMock } from "../mocks/formulas.mjs";

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
    // const formulas = formulasMock
    res.status(200).send({ error: false, data: formulas });
  } catch (error) {
    console.error("Error en GET /api/formulas:", error.message);
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
    // const formula = formulaMock;
    res.status(200).send({ error: false, data: formula });
  } catch (error) {
    console.error("Error en GET /api/formulas/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener la fórmula" });
  }
});

app.post("/api/formulas", async (req, res) => {
  const formula = req.body;
  try {
    const data = await dbConfig.collection().insertOne(formula);
    res.status(201).send({
      error: false,
      mensaje: "Fórmula guardada correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en POST /api/formulas:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al guardar la fórmula" });
  }
});

app.put("/api/formulas/:id", async (req, res) => {
  try {
    const { _id, ...formula } = req.body;
    const { id } = req.params;
    const data = await dbConfig
      .collection()
      .updateOne({ _id: new ObjectId(id) }, { $set: formula });
    res.status(200).send({
      error: false,
      mensaje: "Fórmula actualizada correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en PUT /api/formulas/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al actualizar la fórmula" });
  }
});

app.delete("/api/formulas/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const resultado = await dbConfig
      .collection()
      .deleteOne({ _id: new ObjectId(id) });
    res.status(200).send({
      error: false,
      mensaje: "Fórmula eliminada correctamente",
      resultado,
    });
  } catch (error) {
    console.error("Error en DELETE /api/formulas/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al eliminar la fórmula" });
  }
});

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});
