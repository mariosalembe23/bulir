import { BookingStatus, PrismaClient } from "../../generated/prisma-client";
import { Request, Response } from "express";
import { validate } from "uuid";

import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response) => {
  const { clientId, serviceId, date } = req.body;
  if (!clientId || !serviceId || !date) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

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
    return res.status(400).json({ message: "ID de reserva inválido" });
  }

  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    return res.status(404).json({ message: "Reserva não encontrada" });
  }

  res.json(booking);
};

export const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { date, status } = req.body;

  if (!validate(bookingId)) {
    return res.status(400).json({ message: "ID de reserva inválido" });
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

export const deleteBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  if (!validate(bookingId)) {
    return res.status(400).json({ message: "ID de reserva inválido" });
  }

  await prisma.bookings.delete({ where: { id: bookingId } });

  res.json({ message: "Reserva deletada com sucesso" });
};

export const getBookingsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!validate(userId)) {
    return res.status(400).json({ message: "ID de usuário inválido" });
  }

  const bookings = await prisma.bookings.findMany({
    where: { clientId: userId },
  });

  const fullData = await Promise.all(bookings.map(async (booking) => {
    const service = await prisma.services.findUnique({
      where: { id: booking.serviceId },
    });
    return {
      ...booking,
      service,
    };
  }))

  res.json(fullData);
};
