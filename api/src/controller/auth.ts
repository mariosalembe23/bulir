import { PrismaClient } from "../../generated/prisma-client";
import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }

    const userEmail = await prisma.users.findUnique({ where: { email } });

    const userNif = await prisma.users.findUnique({ where: { nif: email } });

    const user = userEmail || userNif;

    if (!user) {
        return res.status(401).json({ error: "Credenciais Inválidas" });
    }

    if (!bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: "Credenciais Inválidas" });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = Jwt.sign(payload, process.env.JWT_SECRET!);

    res.json({ message: "Login feito com sucesso", token });
};