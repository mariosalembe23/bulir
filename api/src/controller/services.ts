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
  const { title, description, price, balance } = req.body;
  if (!title || !description || !price || !balance) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newService = await prisma.services.create({
    data: {
      title,
      description,
      price,
      balance,
      userId,
    },
  });
  return res.status(201).json(newService);
};

export const getServices = async (req: Request, res: Response) => {
  const services = await prisma.services.findMany();
  res.json(services);
};

export const getServiceById = async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  if (!validate(serviceId)) {
    return res.status(400).json({ error: "Invalid service ID" });
  }

  const service = await prisma.services.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  res.json(service);
};

export const updateService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const { title, description, price, balance } = req.body;

  if (!validate(serviceId)) {
    return res.status(400).json({ error: "Invalid service ID" });
  }

  const updatedService = await prisma.services.update({
    where: { id: serviceId },
    data: { title, description, price, balance },
  });

  res.json(updatedService);
};

export const deleteService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  if (!validate(serviceId)) {
    return res.status(400).json({ error: "Invalid service ID" });
  }

  await prisma.services.delete({ where: { id: serviceId } });

  res.json({ message: "Service deleted successfully" });
};

export const getUserServices = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!validate(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const services = await prisma.services.findMany({
    where: { userId: userId },
  });

  res.json(services);
};
