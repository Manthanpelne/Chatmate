const express = require("express")
const app = express()
require("dotenv").config()
const {connection} = require("./db")
const userRoutes = require("./routes/userRoutes")
const cors = require("cors")
const {chats} = require("../backend/data/data")
const notFound = require("./middlewares/errorMiddleware")
app.use(express.json())
app.use(cors())


app.get("/",(req,res)=>{
    res.send("basic chatapp")
})



app.use("/api/user",userRoutes)


//for error handling
app.use(notFound)


app.listen(process.env.port,async()=>{
    await connection;
    console.log("app running at server "+ process.env.port)
})