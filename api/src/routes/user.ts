import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma-client";
import { registerUser } from "../controller/user";
import { login } from "../controller/auth";
import { validate } from "uuid";
import {
  validateEmail,
  validateName,
  validateNIF,
} from "../utils/formGenerics";

const prisma = new PrismaClient();

const userRoute = express.Router();

userRoute.post("/register", registerUser);

userRoute.post("/login", login);

userRoute.get("/profile/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!validate(id))
    return res.status(404).json({ error: "Usuário não encontrado" });

  const user = await prisma.users.findUnique({ where: { id: id }, omit: { password: true } });

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(user);
});

userRoute.put("/profile/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, nif, name } = req.body;

  if (!validate(id))
    return res.status(404).json({ error: "Usuário não encontrado" });

  if (!validateName(name)) {
    return res
      .status(400)
      .json({ error: "O nome deve ter pelo menos 3 caracteres" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  if (!validateNIF(nif)) {
    return res.status(400).json({ error: "NIF inválido" });
  }

  const updatedUser = await prisma.users.update({
    where: { id: id },
    data: { email, nif, name },
  });

  res.json({ message: "Perfil atualizado com sucesso", user: updatedUser });
});

userRoute.delete("/profile/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!validate(id))
    return res.status(404).json({ error: "Usuário não encontrado" });

  await prisma.users.delete({ where: { id: id } });

  res.json({ message: "Usuário deletado com sucesso" });
});

export default userRoute;
