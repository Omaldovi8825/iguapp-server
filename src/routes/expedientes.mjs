import { Router } from "express";
import { ObjectId } from "mongodb";
import { dbConfig } from "../config/db.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await dbConfig
      .collection("expedientes")
      .find(
        { b_active: true },
        { projection: { b_active: 0, createdAt: 0, cotizaciones: 0 } },
      )
      .toArray();
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en GET /api/expedientes:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener los expedientes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const data = await dbConfig
    //   .collection("expedientes")
    //   .findOne(
    //     { _id: new ObjectId(id) },
    //     { projection: { b_active: 0, createdAt: 0 } },
    //   );
    // const data = expedientesMock[0];
    const [data] = await dbConfig
      .collection("expedientes")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "cotizaciones",
            localField: "_id",
            foreignField: "idExpediente",
            as: "cotizaciones",
          },
        },
        { $project: { b_active: 0 } },
      ])
      .toArray();
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en GET /api/expedientes/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener el expediente" });
  }
});

router.post("/", async (req, res) => {
  try {
    const form = req.body;
    const newExpediente = {
      ...form,
      createdAt: new Date(),
      b_active: true,
    };
    const data = await dbConfig
      .collection("expedientes")
      .insertOne(newExpediente);
    res.status(201).send({ error: false, data });
  } catch (error) {
    console.error("Error en POST /api/expedientes:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al crear el expediente" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const data = await dbConfig
      .collection("expedientes")
      .updateOne({ _id: new ObjectId(id) }, { $set: { nombre } });
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en PUT /api/expedientes:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al actualizar el expediente" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await dbConfig
      .collection("expedientes")
      .updateOne({ _id: new ObjectId(id) }, { $set: { b_active: false } });
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en DELETE /api/expedientes:", error.message);
  }
  res
    .status(500)
    .send({ error: true, mensaje: "Error al eliminar el expediente" });
});

export default router;
