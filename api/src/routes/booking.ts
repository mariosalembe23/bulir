import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma-client";
import { createBooking, getBookingById, getBookings, updateBooking, deleteBooking, getBookingsByUserId} from "../controller/booking";
import { verifyAuthorization } from "../middleware/authorization";

const prisma = new PrismaClient();

const bookingRoute = express.Router();


bookingRoute.post("/create", verifyAuthorization, createBooking);
bookingRoute.get("/all", verifyAuthorization, getBookings);
bookingRoute.get("/each/:bookingId", verifyAuthorization, getBookingById);
bookingRoute.put("/:bookingId", verifyAuthorization, updateBooking);
bookingRoute.delete("/:bookingId", verifyAuthorization, deleteBooking);
bookingRoute.get("/all/:userId", verifyAuthorization, getBookingsByUserId);

export default bookingRoute;