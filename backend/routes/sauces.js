const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const saucesCtrl = require('../controllers/sauces')
const multer = require('../middleware/multer-config')
const sanitize = require("sanitize")

router.get("/", auth, saucesCtrl.getAllSauces)
router.post("/", auth, sanitize, multer, saucesCtrl.createSauce)
router.get("/:id", auth, saucesCtrl.getOneSauce)
router.put("/:id", auth, multer, saucesCtrl.modifySauce)
router.delete("/:id", auth, saucesCtrl.deleteSauce)
router.post("/:id/like", auth, sanitize, saucesCtrl.noticeSauce)

module.exports = router