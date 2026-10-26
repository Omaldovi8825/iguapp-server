import { Router } from "express";
import { ObjectId } from "mongodb";
import { dbConfig } from "../config/db.mjs";
import { formulasMock } from "../../mocks/formulas.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const formulas = await dbConfig
      .collection("formulas")
      .find({ b_active: true }, { projection: { b_active: 0 } })
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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const formula = await dbConfig
      .collection("formulas")
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

router.post("/", async (req, res) => {
  const { _id, ...formula } = req.body;
  try {
    const data = await dbConfig.collection("formulas").insertOne(formula);
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

router.put("/:id", async (req, res) => {
  try {
    const { _id, ...formula } = req.body;
    const { id } = req.params;
    const data = await dbConfig
      .collection("formulas")
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

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const resultado = await dbConfig
      .collection("formulas")
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

export default router;
