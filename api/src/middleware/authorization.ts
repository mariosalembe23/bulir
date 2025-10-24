import { PrismaClient } from "../../generated/prisma-client";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const verifyAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Não autorizado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const userId = decoded?.id as string | undefined;
        if (!userId) {
            return res.status(401).json({ message: "Não autorizado" });
        }

        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: { services: true },
        });

        if (!user) {
            return res.status(401).json({ message: "Usuário não autorizado" });
        }

        (req as any).userId = user.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Não autorizado" });
    }
};