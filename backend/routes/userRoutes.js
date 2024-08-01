const express = require("express")
const {registerUser,authUser, allUsers} = require("../controllers/userController")
const { Authentication } = require("../middlewares/authMiddleware")
const router = express.Router()


 router.route("/").post(registerUser).get(Authentication,allUsers)
 router.post("/login", authUser)
 
 
 module.exports = router