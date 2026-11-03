import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).send({ error: true, mensaje: "Sin token" });
  }
  try {
    const token = header.slice(7); // quita "Bearer "
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({ error: true, mensaje: "Token inválido" });
    }
    next();
  } catch {
    return res.status(401).send({ error: true, mensaje: "Token inválido" });
  }
};
