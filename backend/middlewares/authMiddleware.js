const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
require("dotenv").config()


const Authentication = asyncHandler(async(req,res,next)=>{
let token ;
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    try {
        token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select("-password") //returning without password
        next()
    } catch (error) {
        return res.status(400).send({"Msg":"Login first"})
    }
}

if(!token){
    return res.status(400).send({"msg":"User not logged in. Login first"})
}
})

module.exports = {Authentication}