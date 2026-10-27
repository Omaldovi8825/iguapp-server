import { Router } from "express";
import { ObjectId } from "mongodb";
import { dbConfig } from "../config/db.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const materiales = await dbConfig
      .collection("materiales")
      .find({ b_active: true }, { projection: { b_active: 0 } })
      .toArray();
    res.status(200).send({ error: false, data: materiales });
  } catch (error) {
    console.error("Error en GET /api/materiales:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener los materiales" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const material = await dbConfig
      .collection("materiales")
      .findOne({ _id: new ObjectId(id) });
    res.status(200).send({ error: false, data: material });
  } catch (error) {
    console.error("Error en GET /api/materiales/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener el material" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { _id, ...dataMaterial } = req.body;
    const newMaterial = {
      ...dataMaterial,
      createdAt: new Date(),
      b_active: true,
    };
    const data = await dbConfig.collection("materiales").insertOne(newMaterial);
    res.status(201).send({
      error: false,
      mensaje: "Material guardado correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en POST /api/materiales:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al guardar el material" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { _id, ...dataMaterial } = req.body;
    const { id } = req.params;
    const data = await dbConfig
      .collection("materiales")
      .updateOne({ _id: new ObjectId(id) }, { $set: dataMaterial });
    res.status(200).send({
      error: false,
      mensaje: "Material actualizado correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en PUT /api/materiales/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al actualizar el material" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await dbConfig
      .collection("materiales")
      .updateOne({ _id: new ObjectId(id) }, { $set: { b_active: false } });
    res.status(200).send({
      error: false,
      mensaje: "Material eliminado correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en DELETE /api/materiales/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al eliminar el material" });
  }
});

export default router;
