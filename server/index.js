const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');

const userRouter = require("./Routes/user")
const gcRouter = require("./Routes/groupChat")


// Database connection
const DbConnection = require("./dataBaseConnection");

// Import Routes

dotenv.config()

const port = process.env.PORT || 5000;
const app = express();

// Connecting Database
DbConnection();

app.use(cors());
app.use(express.json());
app.listen(port, () => `Server running on port ${port} 🔥`);

app.get("/", (req,res) =>{
    res.status(200).json({
        message:"server is up and running"
    });
});

app.use("/user", userRouter);
app.use("/group", gcRouter);

app.get("*", (req,res) =>{
    res.status(404).json({
        message:"Route doesn't exist"
    });
});