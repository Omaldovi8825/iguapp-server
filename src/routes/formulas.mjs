import { Router } from "express";
import { ObjectId } from "mongodb";
import { dbConfig } from "../config/db.mjs";

const formatMateriales = (materiales) => {
  return materiales.map(({ id, cantidad, ancho, alto }) => ({
    id: new ObjectId(id),
    cantidad,
    formulas: {
      ancho,
      alto,
    },
  }));
};

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { id_folder } = req.query;
    const formulas = await dbConfig
      .collection("formulas")
      .find(
        { b_active: true, id_folder: new ObjectId(id_folder) },
        { projection: { b_active: 0 } },
      )
      .toArray();

    res.status(200).send({ error: false, data: formulas });
  } catch (error) {
    console.error("Error en GET /api/formulas:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener las fórmulas" });
  }
});

router.get("/single", async (req, res) => {
  try {
    const formulas = await dbConfig
      .collection("formulas")
      .find(
        { b_active: true, id_folder: null },
        { projection: { b_active: 0 } },
      )
      .toArray();

    res.status(200).send({ error: false, data: formulas });
  } catch (error) {
    console.error("Error en GET /api/formulas/single:", error.message);
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
      .findOne({ _id: new ObjectId(id) }, { projection: { b_active: 0 } });
    res.status(200).send({ error: false, data: formula });
  } catch (error) {
    console.error("Error en GET /api/formulas/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener la fórmula" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { id_folder, nombre, materiales } = req.body;

    const materialesFormat = formatMateriales(materiales);

    const newFormula = {
      nombre,
      materiales: materialesFormat,
      id_folder: id_folder ? new ObjectId(id_folder) : null,
      createdAt: new Date(),
      b_active: true,
    };

    const data = await dbConfig.collection("formulas").insertOne(newFormula);
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

router.post("/:id/clone", async (req, res) => {
  try {
    const { id } = req.params;

    const { nombre, materiales, id_folder } = await dbConfig
      .collection("formulas")
      .findOne({ _id: new ObjectId(id) }, { projection: { b_active: 0 } });

    const newFormula = {
      nombre: `${nombre} (copia)`,
      materiales,
      id_folder,
      createdAt: new Date(),
      b_active: true,
    };

    const data = await dbConfig.collection("formulas").insertOne(newFormula);
    res.status(201).send({
      error: false,
      mensaje: "Fórmula clonada correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en POST /api/formulas/:id/clone", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al clonar la fórmula" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { nombre, materiales } = req.body;
    const { id } = req.params;

    const materialesFormat = formatMateriales(materiales);

    const formula = {
      nombre,
      materiales: materialesFormat,
    };

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
      .updateOne({ _id: new ObjectId(id) }, { $set: { b_active: false } });
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
