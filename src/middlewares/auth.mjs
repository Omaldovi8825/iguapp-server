import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ error: true, mensaje: "Sin token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({ error: true, mensaje: "Token inválido" });
    }
    next();
  } catch {
    return res.status(401).send({ error: true, mensaje: "Token inválido" });
  }
};
