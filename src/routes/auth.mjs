import jwt from "jsonwebtoken";
import { Router } from "express";
import { dbConfig } from "../config/db.mjs";
import { authMiddleware } from "../middlewares/auth.mjs";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const auth = await dbConfig.collection("auth").findOne({});
    if (!auth || auth.password !== password) {
      return res
        .status(401)
        .send({ error: true, mensaje: "Password incorrecto" });
    }
    const token = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
    res
      .status(200)
      .send({ error: false, mensaje: "Usuario logueado", data: { token } });
  } catch (error) {
    console.error("Error en POST /api/auth/login:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al loguear el usuario" });
  }
});

router.get("/check-token", authMiddleware, (req, res) => {
  try {
    res.status(200).send({ error: false, mensaje: "Token válido" });
  } catch (error) {
    console.error("Error en GET /api/auth/check-token:", error.message);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al verificar el token" });
  }
});

export default router;
