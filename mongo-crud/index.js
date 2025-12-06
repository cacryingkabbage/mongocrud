import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

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
});

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
});