import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user";
import authRoute from "./routes/auth";
import servicesRoute from "./routes/services";
import cors from "cors";
import bookingRoute from "./routes/booking";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/services", servicesRoute);
app.use("/api/bookings", bookingRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
