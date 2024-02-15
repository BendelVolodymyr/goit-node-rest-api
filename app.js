import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { DB_HOST, PORT } from "process.env";
import contactsRouter from "./routes/contactsRouter.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", true);
mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
