import { PrismaClient } from "../../generated/prisma-client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  validateEmail,
  validateName,
  validateNIF,
  validatePassword,
} from "../utils/formGenerics";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, nif, name, role } = req.body;

  if (!email || !password || !nif || !name || !role) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  if (!validateName(name)) {
    return res
      .status(400)
      .json({ error: "O nome deve ter pelo menos 3 caracteres" });
  }

  if (role !== "CLIENT" && role !== "PROVIDER") {
    return res.status(400).json({ error: "Tipo de conta inválida" });
  }

  if (!validatePassword(password)) {
    return res
      .status(400)
      .json({ error: "A senha deve ter pelo menos 8 caracteres" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  if (!validateNIF(nif)) {
    return res.status(400).json({ error: "NIF inválido" });
  }

  const existingUser = await prisma.users.findFirst({
    where: { OR: [{ email }, { nif }] },
  });

  if (existingUser) {
    return res
      .status(409)
      .json({
        error: "Esta conta já existe, por favor utilize outro email ou NIF",
      });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      nif,
      name,
      role,
    },
  });

  await prisma.users.update({
    where: { id: newUser.id },
    data: { balance: 15000 },
  });

  res
    .status(201)
    .json({ message: "Usuário registrado com sucesso", user: newUser });
};
