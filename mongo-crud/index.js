import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./config/database.js";
import config from "./config/index.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import orderRoutes from "./routes/order.routes.js";
import orderDetailsRoutes from "./routes/orderDetails.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = config.port;

app.use(
  cors({
    origin: [config.corsOrigin, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true, // Allow cookies to be sent
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blataditz Retail API is running",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customers", customerRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/orderDetails", orderDetailsRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new mongodb.MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_NAME || "andrei";
const db = client.db(dbName);
const customerCollections = db.collection("customers");

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to Mongodb");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
}

app.get("/customers", async (req, res) => {
    try {
        const {username, email} = req.query;
        let filter = {};

        if (username) {filter.username = username;}
        if (email) {filter.email = email;}

        const customers = await customerCollections.find(filter).toArray();

        res.status(200).json({
            data: customers,
            message: "Customers fetched successfully",
        }); 
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch customers", error: error.message });
    }
}

app.post("/customers", async (req, res) => {
    try {
         const { username, email, first_name, last_name, date_of_birth, phone_number, address } = req.body;

         if (!username || !email || !first_name || !last_name) {
            return res.status(400).json({ error: "username, email, first_name, and last_name are required" });
         }

         const newCustomer = { ...req.body, created_at: new Date() };
         await customerCollections.insertOne(newCustomer);

         //result.ops[0],
         res.status(201).json({
            data: result,
            message: "Customer created successfully",
         })
        } catch (error) {
        res
            .status(500)
            .json({ message: "Failed to create customer", error: error.message });
    }
});

connectToDatabase().then(() => {
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
}); 

};   
