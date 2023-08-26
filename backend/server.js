import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import connectDb from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
connectDb();
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
// body parser middleware to get the body data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware to get the cookie data
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);
app.use("/api/upload", uploadRoutes);

// make the uploads folder static so that we can access the files inside it
const __dirname = path.resolve(); // set the __dirname variable to the current directory name
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
