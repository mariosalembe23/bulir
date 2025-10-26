import { PrismaClient } from "../../generated/prisma-client";
import { Request, Response } from "express";
import { validate } from "uuid";

import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const createService = async (
  req: Request | any,
  res: Response | any
) => {
  const userId = req.userId;
  const { title, description, price } = req.body;
  if (!title || !description || !price) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  if (title.length < 3) {
    return res
      .status(400)
      .json({ error: "O título deve ter pelo menos 3 caracteres" });
  }

  if (description.length < 10) {
    return res
      .status(400)
      .json({ error: "A descrição deve ter pelo menos 10 caracteres" });
  }

  if (price <= 0) {
    return res.status(400).json({ error: "O preço deve ser maior que zero" });
  }

  const existingService = await prisma.services.findFirst({
    where: { title, userId },
  });

  if (existingService) {
    return res.status(400).json({ error: "Este serviço já existe" });
  }

  const newService = await prisma.services.create({
    data: {
      title,
      description,
      price,
      userId,
    },
  });
  return res.status(201).json(newService);
};

export const getServices = async (req: Request, res: Response) => {
  const services = await prisma.services.findMany();

  const ownerService = await Promise.all(
    services.map(async (service) => {
      const user = await prisma.users.findUnique({
        where: { id: service.userId || "" },
        select: { name: true, email: true },
      });
      return { ...service, owner: user };
    })
  );

  res.json(ownerService);
};

export const getServiceById = async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  if (!validate(serviceId)) {
    return res.status(400).json({ error: "Id Inválido" });
  }

  const service = await prisma.services.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    return res.status(404).json({ error: "Serviço não encontrado" });
  }

  res.json(service);
};

export const updateService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const { title, description, price } = req.body;

  if (!validate(serviceId)) {
    return res.status(400).json({ error: "Id Inválido" });
  }

  const updatedService = await prisma.services.update({
    where: { id: serviceId },
    data: { title, description, price },
  });

  res.json(updatedService);
};

export const deleteService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  if (!validate(serviceId)) {
    return res.status(400).json({ error: "Id Inválido" });
  }

  const pendentBookings = await prisma.bookings.findFirst({
    where: { serviceId: serviceId },
  });

  if (pendentBookings) {
    return res
      .status(400)
      .json({
        error:
          "Não é possível deletar um serviço com reservas pendentes. Finalize a reserva",
      });
  }

  await prisma.bookings.deleteMany({
    where: { serviceId: serviceId },
  });

  await prisma.services.delete({ where: { id: serviceId } });

  res.json({ message: "Serviço foi deletado com sucesso" });
};

export const getUserServices = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!validate(userId)) {
    return res.status(400).json({ error: "Id Inválido" });
  }

  const services = await prisma.services.findMany({
    where: { userId: userId },
  });

  res.json(services);
};
