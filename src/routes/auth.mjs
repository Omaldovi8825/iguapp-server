import jwt from "jsonwebtoken";
import { Router } from "express";
import { dbConfig } from "../config/db.mjs";
import { authMiddleware } from "../middlewares/auth.mjs";

const router = Router();

router.post("/login", async (req, res) => {
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
});

router.get("/check-token", authMiddleware, (req, res) => {
  res.status(200).send({ error: false, mensaje: "Token valido" });
});

export default router;
