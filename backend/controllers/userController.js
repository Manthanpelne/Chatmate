const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');



const registerUser = asyncHandler(async(req,res)=>{
const {name,email,password, pic} = req.body
if(!name || !email || !password){
    res.status(400);
    throw new Error("Please Enter all the Fields")
}

const ifUserExists = await User.findOne({email})
if(ifUserExists){
    res.status(400)
    throw new Error("User already exists")
}

const user = await User.create({
    name,
    email,
    password,
    pic
})

if(user){
    res.status(200).send({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id)
    })
}else{
    res.status(400)
    throw new Error("Failed to Create new User")
}
})



//login api
const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))){
     res.status(200).send({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token : generateToken(user._id)
     })
    } else {
        res.status(400).send("Invalid Email or Password")
    }
})


// /api/user?search=manthan
const allUsers = asyncHandler(async(req,res)=>{
const userName = req.query.search ? {
    $or : [
        {name: {$regex : req.query.search , $options: "i"}},
        {email: {$regex : req.query.search , $options: "i"}}
    ]
} : {}

const user = await User.find(userName).find({_id: {$ne: req.user._id}})
res.status(200).send(user)
})


module.exports = {registerUser,authUser,allUsers}