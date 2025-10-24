import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma-client";

const prisma = new PrismaClient();

const authRoute = express.Router();

authRoute.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.users.findMany();
  res.json(users);
});

export default authRoute;