const asyncHandler = require("express-async-handler")
const Message = require("../models/messageModel")
const User = require("../models/userModel")
const Chat = require("../models/chatModel")

const sendMessage = asyncHandler(async(req,res)=>{
    try {
         const {chatId,content} = req.body
        if(!content || !chatId) {
        return res.status(400).send({message:"Please add message"})
    }
    
    let newMsg = {
        sender : req.user._id,
        content : content,
        chat : chatId
    }
    
    var message = await Message.create(newMsg)
    message = await message.populate("sender","name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
        path : "chat.users",
        select: "name pic email"
    })
    
    await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage : message})
   res.status(200).send(message)
} catch (error) {
    res.status(400).send(error.message)
}
})


//get all messages
const allMessages = asyncHandler(async(req,res)=>{
    try {
        const msg = await Message.find({chat: req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat")
        //console.log(msg)
        res.status(200).send(msg)
    } catch (error) {
        res.status(400).send(error.message) 
    }
})



module.exports = {sendMessage, allMessages}