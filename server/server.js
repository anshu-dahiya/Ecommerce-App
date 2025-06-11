require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRouter');
const cookieParser = require('cookie-parser')

const app = express();
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 5000;


app.get("/", (req,res) => {
    res.json({msg:"This is Example"})
})


app.listen(PORT, () => {
    console.log("Server is Running at...",PORT)
})


app.use("/user",userRoutes)



const URI = process.env.MONGODB_URL;

mongoose.connect(URI)
.then(() => {
    console.log("MongoDB Connected ✅");
}).catch((err) => {
    console.error("❌ MongoDB connection error:",err)
});