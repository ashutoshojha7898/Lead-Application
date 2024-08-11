const express = require("express");
const connectDB = require("./config/db");

const leadRoutes = require("./routes/Lead");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/leads", leadRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
