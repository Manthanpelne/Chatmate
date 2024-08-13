const express = require("express")
const app = express()
require("dotenv").config()
const {connection} = require("./db")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoute")
const cors = require("cors")
const {chats} = require("../backend/data/data")
const path = require("path")
const notFound = require("./middlewares/errorMiddleware")
app.use(express.json())
app.use(cors())




app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)


//deploymentcode
const __dirname1 = path.resolve();
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname1, "/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname1, "frontend", "dist" , "index.html"))
    })
}else{
    app.get("/",(req,res)=>{
        res.send("API is running successfully")
    })
}


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


socket.on("typing", (room)=>socket.in(room).emit("typing"))
socket.on("stop typing", (room)=>socket.in(room).emit("stop typing"))


socket.on("new message",(newMessageRecieved)=>{
    var chat = newMessageRecieved.chat
    if(!chat.users){
      return console.log("chat.users not defined")
        
    }

    chat.users.forEach((user) => {
        if(user._id == newMessageRecieved.sender._id ) return
        
        socket.in(user._id).emit("message recieved", newMessageRecieved)
    });
})

})