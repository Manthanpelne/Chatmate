const asyncHandler = require("express-async-handler")
const Chat = require("../models/chatModel")
const User = require("../models/userModel")
const { patch } = require("../routes/chatRoutes")

const accessChat = asyncHandler(async(req,res)=>{
    const {userId} = req.body
    if(!userId){
        return res.status(400).send({"msg":"User not found"})
    }

    var isChat = await Chat.find({
        isGroupChat : false , 
        $and : [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ]
    }).populate("users","-password").populate("latestMessage")
   
    isChat = await User.populate(isChat, {
    path : "latestMessage.sender",
    select:"name pic email"
    })
    
    if(isChat.length > 0){
        res.send(isChat[0])
    }else{
        let chatData = {
            chatName : "sender",
            isGroupChat : false,
            users: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({_id:createdChat._id}).populate("users","-password")
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400).send(error)
        }
    }
})


//fetch all chats
const fetchChats = asyncHandler(async(req,res)=>{
    try {
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt : -1})
        .then(async(result)=>{
           result = await User.populate(result,{
            path: "latestMessage.sender",
            select: "name pic email"
           })
           res.status(200).send(result)
        })
    } catch (error) {
        res.status(400).send(error)
    }
}) 



//groupchat api
const createGroupChat = asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"Please fill all the fields"})
    }
    var users = req.body.users
    if(users.length<2){
        return res.status(400).send({message:"Add more persons for group chat"})
    }

    users.push(req.user)
   
    try {
        //create groupchat & add to DB
        const addGroupChat = await Chat.create({
            chatName : req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        //fetch this group chat from DB and display on UI
        const getGroupChat = await Chat.findOne({_id: addGroupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")

        res.status(200).send(getGroupChat)

    } catch (error) {
        res.status(400).send(error)
    }
})


//rename groupname API
const renameGroup = asyncHandler(async(req,res)=>{
    const {chatId, chatName} = req.body
    const updatedChatName = await Chat.findByIdAndUpdate(chatId, {chatName},{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!updatedChatName){
        return res.status(400).send({message:"Chat not found"})
    }else{
        res.status(200).send(updatedChatName)
    }
})


//add members to group api
const addToGroup = asyncHandler(async(req,res)=>{
    const {chatId, userId} = req.body
    const addUsers = await Chat.findByIdAndUpdate(chatId, {$push: {users: userId}}, {new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!addUsers){
        return res.status(400).send({message:"Chat not found"})
    }else{
        res.status(200).send(addUsers)
    }
})


//remove members from group api
const removeFromGroup = asyncHandler(async(req,res)=>{
    const {chatId, userId} = req.body
    const removeUser = await Chat.findByIdAndUpdate(chatId, {$pull: {users: userId}}, {new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!removeUser){
        return res.status(400).send({message:"Chat not found"})
    }else{
        res.status(200).send(addUsers)
    }
})


module.exports = {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup}