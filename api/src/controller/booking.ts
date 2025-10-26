import { BookingStatus, PrismaClient } from "../../generated/prisma-client";
import { Request, Response } from "express";
import { validate } from "uuid";

import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response) => {
  const { clientId, serviceId, date } = req.body;
  if (!clientId || !serviceId || !date) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const existingBooking = await prisma.bookings.findFirst({
    where: {
      clientId,
      serviceId,
      date: new Date(date),
    },
  });

  if (existingBooking) {
    return res.status(400).json({
      error: "Você já tem uma reserva para este serviço nesta data",
    });
  }

  const removeBalance = async () => {
    const service = await prisma.services.findUnique({
      where: { id: serviceId },
    });

    const client = await prisma.users.findUnique({
      where: { id: clientId },
    });

    if (!service || !client) {
      return res
        .status(404)
        .json({ error: "Serviço ou cliente não encontrado" });
    }

    if (client.balance < service.price) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    await prisma.users.update({
      where: { id: clientId },
      data: { balance: client.balance - service.price },
    });

    await prisma.users.update({
      where: { id: service.userId || "" },
      data: { balance: { increment: service.price } },
    });
  };

  await removeBalance();

  const newBooking = await prisma.bookings.create({
    data: {
      clientId,
      serviceId,
      date: new Date(date),
    },
  });
  res.status(201).json(newBooking);
};

export const getBookings = async (req: Request, res: Response) => {
  const bookings = await prisma.bookings.findMany();
  res.json(bookings);
};

export const getBookingById = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  if (!validate(bookingId)) {
    return res.status(400).json({ error: "ID de reserva inválido" });
  }

  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    return res.status(404).json({ error: "Reserva não encontrada" });
  }

  res.json(booking);
};

export const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { date, status } = req.body;

  if (!validate(bookingId)) {
    return res.status(400).json({ error: "ID de reserva inválido" });
  }
  const updatedBooking = await prisma.bookings.update({
    where: { id: bookingId },
    data: {
      date: new Date(date),
      status: status as BookingStatus,
    },
  });

  return res.status(200).json(updatedBooking);
};

export const deleteBooking = async (req: Request | any, res: Response) => {
  const { bookingId } = req.params;

  if (!validate(bookingId)) {
    return res.status(400).json({ error: "ID de reserva inválido" });
  }

  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    return res.status(404).json({ error: "Reserva não encontrada" });
  }

  if (booking.status !== "PENDING") {
    return res
      .status(400)
      .json({ error: "Apenas reservas pendentes podem ser deletadas" });
  }

  await prisma.bookings.delete({ where: { id: bookingId } });

  const service = await prisma.services.findUnique({
    where: { id: booking.serviceId },
  });

  if (service) {
    await prisma.users.update({
      where: { id: booking.clientId },
      data: { balance: { increment: service.price } },
    });
  }
  
  res.json({ message: "Reserva deletada com sucesso" });
};

export const getBookingsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!validate(userId)) {
    return res.status(400).json({ error: "ID de usuário inválido" });
  }

  const bookings = await prisma.bookings.findMany({
    where: { clientId: userId },
  });

  const fullData = await Promise.all(
    bookings.map(async (booking) => {
      const service = await prisma.services.findUnique({
        where: { id: booking.serviceId },
      });
      return {
        ...booking,
        service,
      };
    })
  );

  res.json(fullData);
};
