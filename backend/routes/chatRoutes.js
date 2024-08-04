const express = require("express")
const { Authentication } = require("../middlewares/authMiddleware")
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatController")
const router = express.Router()

router.route("/").post(Authentication, accessChat)
router.route("/").get(Authentication, fetchChats)
router.route("/group").post(Authentication, createGroupChat )
router.route("/rename").put(Authentication, renameGroup)
router.route("/removeFromGroup").put(Authentication, removeFromGroup)
router.route("/addToGroup").put(Authentication, addToGroup)


module.exports = router