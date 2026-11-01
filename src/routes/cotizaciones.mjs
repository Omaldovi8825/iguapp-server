import { Router } from "express";
import { ObjectId } from "mongodb";
import { dbConfig } from "../config/db.mjs";

const router = Router();

const formatMateriales = (materiales) => {
  return materiales.map((material) => {
    return {
      ...material,
      id: new ObjectId(material.id),
    };
  });
};

router.get("/", async (req, res) => {
  try {
    const { id_expediente } = req.query;
    const data = await dbConfig
      .collection("cotizaciones")
      .find(
        {
          b_active: true,
          id_expediente: new ObjectId(id_expediente),
        },
        { projection: { b_active: 0 } },
      )
      .toArray();
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en GET /api/cotizaciones:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener las cotizaciones" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await dbConfig
      .collection("cotizaciones")
      .findOne({ _id: new ObjectId(id) }, { projection: { b_active: 0 } });
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en GET /api/cotizaciones/:id:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al obtener la cotización" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { id_expediente, formula, materiales, ...rest } = req.body;
    const newCotizacion = {
      ...rest,
      id_expediente: new ObjectId(id_expediente),
      materiales: formatMateriales(materiales),
      formula: {
        id: new ObjectId(formula.id),
        id_folder:
          formula.id_folder !== "0" ? new ObjectId(formula.id_folder) : null,
      },
      createdAt: new Date(),
      b_active: true,
    };
    const data = await dbConfig
      .collection("cotizaciones")
      .insertOne(newCotizacion);
    res.status(201).send({ error: false, data });
  } catch (error) {
    console.error("Error en POST /api/cotizaciones:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al crear la cotización" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { _id, id_expediente, formula, materiales, ...rest } = req.body;
    const dataCotizacion = {
      ...rest,
      materiales: formatMateriales(materiales),
      id_expediente: new ObjectId(id_expediente),
      formula: {
        id: new ObjectId(formula.id),
        id_folder:
          formula.id_folder !== "0" ? new ObjectId(formula.id_folder) : null,
      },
    };

    const data = await dbConfig
      .collection("cotizaciones")
      .updateOne({ _id: new ObjectId(id) }, { $set: dataCotizacion });
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en PUT /api/cotizaciones:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al actualizar la cotización" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await dbConfig
      .collection("cotizaciones")
      .updateOne({ _id: new ObjectId(id) }, { $set: { b_active: false } });
    res.status(200).send({ error: false, data });
  } catch (error) {
    console.error("Error en DELETE /api/cotizaciones:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al eliminar la cotización" });
  }
});

export default router;
