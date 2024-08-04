const express = require("express")
const { Authentication } = require("../middlewares/authMiddleware")
const { sendMessage, allMessages } = require("../controllers/messageController")
const router = express.Router()

router.route("/").post(Authentication, sendMessage)
router.route("/:chatId").get(Authentication, allMessages)

module.exports = router