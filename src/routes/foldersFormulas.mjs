import { Router } from "express";
import { ObjectId } from "mongodb";
import { dbConfig } from "../config/db.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await dbConfig
      .collection("foldersFormulas")
      .find({ b_active: true }, { projection: { b_active: 0 } })
      .toArray();
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en GET /api/folders-formulas:", error.message);
    res
      .status(500)
      .send({
        error: true,
        mensaje: "Error al obtener los folders de fórmulas",
      });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await dbConfig
      .collection("foldersFormulas")
      .findOne({ _id: new ObjectId(id) }, { projection: { b_active: 0 } });
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en GET /api/folders-formulas/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener el folder de fórmulas" });
  }
});

router.post("/", async (req, res) => {
  try {
    const form = req.body;
    const newFolder = {
      ...form,
      createdAt: new Date(),
      b_active: true,
    };
    const data = await dbConfig
      .collection("foldersFormulas")
      .insertOne(newFolder);
    res.status(201).send({ error: false, data });
  } catch (error) {
    console.error("Error en POST /api/folders-formulas:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al crear el folder de fórmulas" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const data = await dbConfig
      .collection("foldersFormulas")
      .updateOne({ _id: new ObjectId(id) }, { $set: { nombre } });
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en PUT /api/folders-formulas:", error.message);
    res
      .status(500)
      .send({
        error: true,
        mensaje: "Error al actualizar el folder de fórmulas",
      });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await dbConfig
      .collection("foldersFormulas")
      .updateOne({ _id: new ObjectId(id) }, { $set: { b_active: false } });

    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en DELETE /api/folders-formulas:", error.message);
  }
  res
    .status(500)
    .send({ error: true, mensaje: "Error al eliminar el folder de fórmulas" });
});

export default router;
