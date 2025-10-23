import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma-client";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validate } from "uuid";

const prisma = new PrismaClient();

const router = express.Router();

// ========= User ACTIONS =========
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, nif, name, role } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password || !nif || !name || !role) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  if (name.length < 3) {
    return res
      .status(400)
      .json({ error: "O nome deve ter pelo menos 3 caracteres" });
  }

  if (role !== "CLIENT" && role !== "PROVIDER") {
    return res.status(400).json({ error: "Tipo de conta inválida" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "A senha deve ter pelo menos 8 caracteres" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  if (nif.length !== 14) {
    return res.status(400).json({ error: "NIF inválido" });
  }

  const existingUser = await prisma.users.findFirst({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ error: "Conta já existe" });
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

  res
    .status(201)
    .json({ message: "Usuário registrado com sucesso", user: newUser });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: "Credenciais Inválidas" });
  }

  if (!bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: "Credenciais Inválidas" });
  }

  const payload = { id: user.id, email: user.email };
  const token = Jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });

  res.json({ message: "Login feitoc com sucesso", token });
});
// ========= User ACTIONS =========

// ========= Admin ACTIONS =========
router.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.users.findMany();
  res.json(users);
});
// ========= Admin ACTIONS =========

router.get("/profile/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!validate(id))
    return res.status(404).json({ error: "Usuário não encontrado" });

  const user = await prisma.users.findUnique({ where: { id: id } });

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(user);
});

export default router;
