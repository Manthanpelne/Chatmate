const express = require("express")
const app = express()
require("dotenv").config()
const {connection} = require("./db")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoute")
const cors = require("cors")
const {chats} = require("../backend/data/data")
const notFound = require("./middlewares/errorMiddleware")
app.use(express.json())
app.use(cors())


app.get("/",(req,res)=>{
    res.send("basic chatapp")
})



app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)


//for error handling
app.use(notFound)


const server = app.listen(process.env.port,async()=>{
    await connection;
    console.log("app running at server "+ process.env.port)
})


// socket io server
const io=require("socket.io")(server,{
    pingTimeout: 60000,
    cors:{
        origin:"http://localhost:5173"
    }
})
io.on("connection",(socket)=>{
    console.log("connected to socket.io")

socket.on("setup",(userData)=>{
socket.join(userData._id)
//console.log(userData._id)
socket.emit("connected")
})


socket.on("join chat",(room)=>{
    socket.join(room)
    console.log("user joined room:" + room)
})


socket.on("new message",(newMessageRecieved)=>{
    var chat = newMessageRecieved.chat
    if(!chat.users){
        console.log("chat.users not defined")
        return
    }

    chat.users.forEach((user) => {
        if(user._id == newMessageRecieved.sender._id ) return
        
        socket.in(user._id).emit("message recieved", newMessageRecieved)
    });
})

})